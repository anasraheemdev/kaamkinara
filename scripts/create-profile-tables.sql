-- Create profile-related tables and functions

-- Add profile image and additional fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add more fields to worker_profiles
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2);
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS availability_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "17:00", "available": true}, "tuesday": {"start": "09:00", "end": "17:00", "available": true}, "wednesday": {"start": "09:00", "end": "17:00", "available": true}, "thursday": {"start": "09:00", "end": "17:00", "available": true}, "friday": {"start": "09:00", "end": "17:00", "available": true}, "saturday": {"start": "09:00", "end": "17:00", "available": false}, "sunday": {"start": "09:00", "end": "17:00", "available": false}}';
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS service_radius INTEGER DEFAULT 10;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS portfolio_images TEXT[] DEFAULT '{}';
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}';
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{"English"}';

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    theme VARCHAR(20) DEFAULT 'light',
    privacy_profile VARCHAR(20) DEFAULT 'public',
    two_factor_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create user_addresses table for multiple addresses
CREATE TABLE IF NOT EXISTS user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    label VARCHAR(50) NOT NULL, -- 'home', 'work', 'other'
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Pakistan',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- User settings policies
CREATE POLICY "Users can view own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User addresses policies
CREATE POLICY "Users can view own addresses" ON user_addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own addresses" ON user_addresses
    FOR ALL USING (auth.uid() = user_id);

-- Create default settings for existing users
INSERT INTO user_settings (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_settings WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;

-- Grant permissions
GRANT ALL ON user_settings TO authenticated;
GRANT ALL ON user_addresses TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
