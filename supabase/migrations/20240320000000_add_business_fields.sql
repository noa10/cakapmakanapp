-- Add business-related fields to profiles table
ALTER TABLE profiles
ADD COLUMN is_business_mode BOOLEAN DEFAULT FALSE,
ADD COLUMN business_name TEXT,
ADD COLUMN business_address TEXT;

-- Add RLS policies for business fields
ALTER POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

ALTER POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Add indexes for better query performance
CREATE INDEX idx_profiles_business_mode ON profiles(is_business_mode); 