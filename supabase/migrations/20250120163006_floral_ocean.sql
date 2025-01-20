/*
  # Initial Schema Setup

  1. New Tables
    - `agents`
      - `id` (uuid, primary key)
      - `name` (text)
      - `system_prompt` (text)
      - `tools` (jsonb)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `prompt_history`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, references agents)
      - `user_id` (uuid, references auth.users)
      - `old_prompt` (text)
      - `new_prompt` (text)
      - `old_tools` (jsonb)
      - `new_tools` (jsonb)
      - `modified_at` (timestamptz)
      - `type` (text)

    - `mongodb_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `uri` (text)
      - `database` (text)
      - `collection` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  system_prompt text NOT NULL DEFAULT '',
  tools jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create prompt_history table
CREATE TABLE IF NOT EXISTS prompt_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  old_prompt text,
  new_prompt text,
  old_tools jsonb,
  new_tools jsonb,
  modified_at timestamptz DEFAULT now(),
  type text NOT NULL CHECK (type IN ('prompt', 'tools', 'both'))
);

-- Create mongodb_settings table
CREATE TABLE IF NOT EXISTS mongodb_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  uri text NOT NULL,
  database text NOT NULL,
  collection text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE mongodb_settings ENABLE ROW LEVEL SECURITY;

-- Policies for agents
CREATE POLICY "Users can read all agents"
  ON agents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create agents"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own agents"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Policies for prompt_history
CREATE POLICY "Users can read own prompt history"
  ON prompt_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create prompt history"
  ON prompt_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for mongodb_settings
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mongodb_settings_updated_at
  BEFORE UPDATE ON mongodb_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();