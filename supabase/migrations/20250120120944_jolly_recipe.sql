/*
  # Initial Schema Setup

  1. New Tables
    - `agents`
      - `id` (uuid, primary key)
      - `name` (text)
      - `system_prompt` (text)
      - `tools` (jsonb)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `prompt_history`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, references agents)
      - `user_id` (uuid, references auth.users)
      - `old_prompt` (text)
      - `new_prompt` (text)
      - `old_tools` (jsonb)
      - `new_tools` (jsonb)
      - `modified_at` (timestamp)
      - `type` (text)

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

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;

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