-- Check auth users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- Check users table
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    created_at
FROM public.users 
ORDER BY created_at DESC 
LIMIT 10;

-- Check worker profiles
SELECT 
    wp.id,
    wp.user_id,
    u.email,
    wp.skills,
    wp.verification_status
FROM public.worker_profiles wp
JOIN public.users u ON wp.user_id = u.id
ORDER BY wp.created_at DESC 
LIMIT 10;

-- Check for users without profiles
SELECT 
    au.id,
    au.email,
    au.email_confirmed_at,
    u.id as profile_exists
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
ORDER BY au.created_at DESC;
