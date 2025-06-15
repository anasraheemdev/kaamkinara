-- Test basic database operations
SELECT 'Database connection test' as test_name;

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'worker_profiles');

-- Test inserting a user directly
INSERT INTO public.users (id, email, first_name, last_name, role) 
VALUES ('test-user-123', 'test@example.com', 'Test', 'User', 'customer')
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Verify the insert worked
SELECT * FROM public.users WHERE id = 'test-user-123';

-- Clean up test data
DELETE FROM public.users WHERE id = 'test-user-123';

SELECT 'Database test completed successfully' as result;
