-- Disable RLS temporarily to fix existing issues
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Workers can view own profile" ON public.worker_profiles;
DROP POLICY IF EXISTS "Workers can update own profile" ON public.worker_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.worker_profiles;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create more permissive RLS policies for users table
CREATE POLICY "Allow authenticated users to view users" ON public.users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert users" ON public.users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to delete own profile" ON public.users
    FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for worker_profiles table
CREATE POLICY "Allow authenticated users to view worker profiles" ON public.worker_profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert worker profiles" ON public.worker_profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow workers to update own profile" ON public.worker_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow workers to delete own profile" ON public.worker_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for bookings table
CREATE POLICY "Allow authenticated users to view bookings" ON public.bookings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = worker_id);

-- Create RLS policies for messages table
CREATE POLICY "Allow authenticated users to view messages" ON public.messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Ensure the trigger function has proper permissions
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;
