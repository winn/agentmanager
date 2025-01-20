/*
  # Create MongoDB Settings Table

  1. New Tables
    - `mongodb_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `uri` (text, encrypted MongoDB connection string)
      - `database` (text, database name)
      - `collection` (text, collection name)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `mongodb_settings` table
    - Add policies for users to manage their own settings
    - Ensure users can only access their own settings
*/

-- Create the mongodb_settings table
CREATE TABLE IF NOT EXISTS mongodb_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  uri text NOT NULL,
  database text NOT NULL,
  collection text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE mongodb_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own settings"
  ON mongodb_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON mongodb_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON mongodb_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mongodb_settings_updated_at
  BEFORE UPDATE ON mongodb_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create unique constraint to ensure one settings per user
ALTER TABLE mongodb_settings
  ADD CONSTRAINT unique_user_settings UNIQUE (user_id);