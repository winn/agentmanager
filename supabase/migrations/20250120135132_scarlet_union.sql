/*
  # Create agents and tools tables

  1. New Tables
    - `agents`
      - `id` (uuid, primary key)
      - `name` (text)
      - `system_prompt` (text)
      - `tools` (jsonb)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `agents` table
    - Add policies for authenticated users to:
      - Read all agents
      - Create their own agents
      - Update their own agents
*/

CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  system_prompt text NOT NULL DEFAULT '',
  tools jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();