-- Add Grab Food integration fields to profiles table
ALTER TABLE profiles
ADD COLUMN grab_client_id TEXT,
ADD COLUMN grab_client_secret TEXT;

-- Add RLS policies for Grab integration fields
ALTER POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

ALTER POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Add indexes for better query performance
CREATE INDEX idx_profiles_grab_integration ON profiles(grab_client_id); 