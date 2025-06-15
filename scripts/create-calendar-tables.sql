-- Create calendar and booking related tables

-- Users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) CHECK (role IN ('customer', 'worker', 'admin')) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Worker profiles table
CREATE TABLE IF NOT EXISTS worker_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_category VARCHAR(100) NOT NULL,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  bio TEXT,
  location VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Worker availability table
CREATE TABLE IF NOT EXISTS worker_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(worker_id, day_of_week, start_time)
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price_type VARCHAR(20) CHECK (price_type IN ('hourly', 'fixed', 'range')) DEFAULT 'hourly',
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  duration_hours DECIMAL(4,2) DEFAULT 1.0,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_hours DECIMAL(4,2) NOT NULL,
  location TEXT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  notes TEXT,
  customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
  worker_rating INTEGER CHECK (worker_rating >= 1 AND worker_rating <= 5),
  customer_review TEXT,
  worker_review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking time slots table (for blocking specific time slots)
CREATE TABLE IF NOT EXISTS booking_time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Worker settings table
CREATE TABLE IF NOT EXISTS worker_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE UNIQUE,
  auto_accept_bookings BOOLEAN DEFAULT FALSE,
  buffer_time_minutes INTEGER DEFAULT 30,
  advance_booking_days INTEGER DEFAULT 30,
  minimum_notice_hours INTEGER DEFAULT 2,
  max_bookings_per_day INTEGER DEFAULT 10,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_worker_id ON bookings(worker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_worker_availability_worker_id ON worker_availability(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_availability_day ON worker_availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_services_worker_id ON services(worker_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Worker profiles
CREATE POLICY "Anyone can read worker profiles" ON worker_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Workers can update own profile" ON worker_profiles FOR ALL USING (auth.uid() = user_id);

-- Worker availability
CREATE POLICY "Anyone can read worker availability" ON worker_availability FOR SELECT TO authenticated USING (true);
CREATE POLICY "Workers can manage own availability" ON worker_availability FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM worker_profiles WHERE id = worker_id)
);

-- Services
CREATE POLICY "Anyone can read active services" ON services FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Workers can manage own services" ON services FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM worker_profiles WHERE id = worker_id)
);

-- Bookings
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT USING (
  auth.uid() = customer_id OR 
  auth.uid() IN (SELECT user_id FROM worker_profiles WHERE id = worker_id)
);
CREATE POLICY "Customers can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (
  auth.uid() = customer_id OR 
  auth.uid() IN (SELECT user_id FROM worker_profiles WHERE id = worker_id)
);

-- Booking time slots
CREATE POLICY "Users can read booking time slots" ON booking_time_slots FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can manage booking time slots" ON booking_time_slots FOR ALL USING (true);

-- Worker settings
CREATE POLICY "Workers can manage own settings" ON worker_settings FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM worker_profiles WHERE id = worker_id)
);
