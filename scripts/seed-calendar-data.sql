-- Seed data for calendar and booking system

-- Insert sample users
INSERT INTO users (id, email, full_name, phone, role, avatar_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'John Doe', '+92-300-1234567', 'customer', '/placeholder.svg?height=40&width=40'),
  ('550e8400-e29b-41d4-a716-446655440002', 'ahmed.hassan@example.com', 'Ahmed Hassan', '+92-300-2345678', 'worker', '/placeholder.svg?height=40&width=40'),
  ('550e8400-e29b-41d4-a716-446655440003', 'muhammad.ali@example.com', 'Muhammad Ali', '+92-300-3456789', 'worker', '/placeholder.svg?height=40&width=40'),
  ('550e8400-e29b-41d4-a716-446655440004', 'fatima.khan@example.com', 'Fatima Khan', '+92-300-4567890', 'worker', '/placeholder.svg?height=40&width=40'),
  ('550e8400-e29b-41d4-a716-446655440005', 'sarah.ahmed@example.com', 'Sarah Ahmed', '+92-300-5678901', 'customer', '/placeholder.svg?height=40&width=40')
ON CONFLICT (email) DO NOTHING;

-- Insert worker profiles
INSERT INTO worker_profiles (id, user_id, service_category, skills, experience_years, hourly_rate, bio, location, is_verified, rating, total_reviews, total_jobs) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Plumbing', ARRAY['Pipe Repair', 'Installation', 'Emergency'], 5, 800.00, 'Expert plumber with 5+ years experience', 'Karachi', true, 4.9, 127, 156),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Electrical', ARRAY['Wiring', 'AC Repair', 'Installation'], 7, 600.00, 'Licensed electrician with extensive experience', 'Karachi', true, 4.8, 89, 142),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Cleaning', ARRAY['Deep Clean', 'Eco-friendly', 'Professional'], 3, 400.00, 'Professional cleaning services with eco-friendly products', 'Karachi', true, 4.9, 203, 234)
ON CONFLICT DO NOTHING;

-- Insert worker availability (Monday to Saturday)
INSERT INTO worker_availability (worker_id, day_of_week, start_time, end_time, is_available) VALUES
  -- Ahmed Hassan (Plumber) - Monday to Saturday
  ('660e8400-e29b-41d4-a716-446655440001', 1, '08:00', '18:00', true),
  ('660e8400-e29b-41d4-a716-446655440001', 2, '08:00', '18:00', true),
  ('660e8400-e29b-41d4-a716-446655440001', 3, '08:00', '18:00', true),
  ('660e8400-e29b-41d4-a716-446655440001', 4, '08:00', '18:00', true),
  ('660e8400-e29b-41d4-a716-446655440001', 5, '08:00', '16:00', true),
  ('660e8400-e29b-41d4-a716-446655440001', 6, '09:00', '15:00', true),
  
  -- Muhammad Ali (Electrician) - Monday to Friday
  ('660e8400-e29b-41d4-a716-446655440002', 1, '09:00', '17:00', true),
  ('660e8400-e29b-41d4-a716-446655440002', 2, '09:00', '17:00', true),
  ('660e8400-e29b-41d4-a716-446655440002', 3, '09:00', '17:00', true),
  ('660e8400-e29b-41d4-a716-446655440002', 4, '09:00', '17:00', true),
  ('660e8400-e29b-41d4-a716-446655440002', 5, '09:00', '15:00', true),
  
  -- Fatima Khan (Cleaner) - All week
  ('660e8400-e29b-41d4-a716-446655440003', 1, '08:00', '16:00', true),
  ('660e8400-e29b-41d4-a716-446655440003', 2, '08:00', '16:00', true),
  ('660e8400-e29b-41d4-a716-446655440003', 3, '08:00', '16:00', true),
  ('660e8400-e29b-41d4-a716-446655440003', 4, '08:00', '16:00', true),
  ('660e8400-e29b-41d4-a716-446655440003', 5, '08:00', '16:00', true),
  ('660e8400-e29b-41d4-a716-446655440003', 6, '09:00', '14:00', true),
  ('660e8400-e29b-41d4-a716-446655440003', 0, '10:00', '14:00', true)
ON CONFLICT DO NOTHING;

-- Insert services
INSERT INTO services (id, worker_id, title, description, category, price_type, min_price, max_price, duration_hours, tags, is_active) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Professional Plumbing Services', 'Expert plumbing solutions for residential and commercial properties', 'Plumbing', 'hourly', 800.00, 800.00, 2.0, ARRAY['Emergency', 'Residential', 'Commercial'], true),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Kitchen & Bathroom Renovation', 'Complete renovation services with modern fixtures', 'Plumbing', 'range', 15000.00, 50000.00, 8.0, ARRAY['Renovation', 'Modern', 'Quality'], true),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Emergency Electrical Repair', 'Quick and reliable emergency electrical services', 'Electrical', 'hourly', 1200.00, 1200.00, 2.0, ARRAY['Emergency', 'Licensed', 'Quick'], true),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'Deep Cleaning Services', 'Comprehensive cleaning with eco-friendly products', 'Cleaning', 'range', 2500.00, 8000.00, 4.0, ARRAY['Deep Clean', 'Eco-friendly', 'Professional'], true)
ON CONFLICT DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (id, customer_id, worker_id, service_id, title, description, booking_date, start_time, end_time, duration_hours, location, status, amount, notes) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Kitchen Sink Repair', 'Kitchen sink repair needed urgently', CURRENT_DATE + INTERVAL '1 day', '10:00', '12:00', 2.0, 'DHA Phase 5, Karachi', 'confirmed', 2500.00, 'Kitchen sink repair needed urgently'),
  ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', 'Electrical Repair', 'Wiring issue in living room', CURRENT_DATE + INTERVAL '2 days', '14:00', '17:00', 3.0, 'Gulshan-e-Iqbal, Karachi', 'confirmed', 1800.00, 'Wiring issue in living room'),
  ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440004', 'House Cleaning', 'Deep cleaning for entire house', CURRENT_DATE + INTERVAL '3 days', '09:00', '13:00', 4.0, 'Clifton, Karachi', 'pending', 3200.00, 'Deep cleaning for entire house'),
  ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', 'Bathroom Renovation', 'Complete bathroom renovation', CURRENT_DATE - INTERVAL '5 days', '11:00', '17:00', 6.0, 'North Nazimabad, Karachi', 'completed', 8000.00, 'Complete bathroom renovation'),
  ('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', 'AC Repair', 'Air conditioning not working', CURRENT_DATE - INTERVAL '10 days', '15:00', '17:00', 2.0, 'Malir, Karachi', 'completed', 1500.00, 'Air conditioning not working')
ON CONFLICT DO NOTHING;

-- Insert worker settings
INSERT INTO worker_settings (worker_id, auto_accept_bookings, buffer_time_minutes, advance_booking_days, minimum_notice_hours, max_bookings_per_day) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', false, 30, 30, 2, 8),
  ('660e8400-e29b-41d4-a716-446655440002', true, 45, 21, 4, 6),
  ('660e8400-e29b-41d4-a716-446655440003', false, 15, 14, 1, 10)
ON CONFLICT DO NOTHING;

-- Insert booking time slots for existing bookings
INSERT INTO booking_time_slots (booking_id, slot_date, slot_time)
SELECT 
  b.id,
  b.booking_date,
  (b.start_time::time + (generate_series(0, EXTRACT(EPOCH FROM (b.end_time::time - b.start_time::time))/1800 - 1) * interval '30 minutes'))::time
FROM bookings b
WHERE b.status IN ('confirmed', 'in_progress', 'completed')
ON CONFLICT DO NOTHING;
