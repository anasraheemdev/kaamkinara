-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'worker', 'admin')),
    city VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create worker_profiles table
CREATE TABLE IF NOT EXISTS public.worker_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    cnic VARCHAR(20),
    skills TEXT[] DEFAULT '{}',
    experience_level VARCHAR(20),
    bio TEXT,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = COALESCE(EXCLUDED.first_name, users.first_name),
        last_name = COALESCE(EXCLUDED.last_name, users.last_name),
        role = COALESCE(EXCLUDED.role, users.role),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for worker_profiles table
CREATE POLICY "Workers can view own profile" ON public.worker_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Workers can update own profile" ON public.worker_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users" ON public.worker_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for bookings table
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = worker_id);

CREATE POLICY "Customers can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = worker_id);

-- Create RLS policies for messages table
CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Update email confirmation settings
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;

-- Insert some test data if tables are empty
INSERT INTO public.users (id, email, first_name, last_name, role) 
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'customer@test.com', 'Test', 'Customer', 'customer'),
    ('00000000-0000-0000-0000-000000000002', 'worker@test.com', 'Test', 'Worker', 'worker')
ON CONFLICT (id) DO NOTHING;

-- Insert corresponding auth users if they don't exist
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'customer@test.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"first_name": "Test", "last_name": "Customer", "role": "customer"}'),
    ('00000000-0000-0000-0000-000000000002', 'worker@test.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"first_name": "Test", "last_name": "Worker", "role": "worker"}')
ON CONFLICT (id) DO NOTHING;

-- Insert worker profile for test worker
INSERT INTO public.worker_profiles (user_id, skills, experience_level, bio, verification_status)
VALUES 
    ('00000000-0000-0000-0000-000000000002', ARRAY['Plumber', 'Electrician'], '2-5', 'Experienced worker with multiple skills', 'verified')
ON CONFLICT (user_id) DO NOTHING;
