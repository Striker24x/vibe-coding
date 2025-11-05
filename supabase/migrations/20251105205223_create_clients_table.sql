/*
  # Create Clients Table for Monitoring Dashboard

  1. New Tables
    - `clients`
      - `id` (uuid, primary key) - Unique identifier for each client
      - `name` (text) - Client name
      - `host` (text) - Client hostname/IP address
      - `status` (text) - Current status (online, offline, warning)
      - `os` (text) - Operating system
      - `cpu_usage` (numeric) - CPU usage percentage
      - `memory_usage` (numeric) - Memory usage percentage
      - `disk_usage` (numeric) - Disk usage percentage
      - `uptime` (numeric) - System uptime in seconds
      - `last_seen` (timestamptz) - Last time client was seen
      - `created_at` (timestamptz) - When client was added
      - `updated_at` (timestamptz) - Last update time
      - `monitoring_enabled` (boolean) - Whether monitoring is active
      - `auto_heal` (boolean) - Whether auto-healing is enabled

  2. Security
    - Enable RLS on `clients` table
    - Add policy for public read access (for demo purposes)
    - Add policy for public write access (for demo purposes)

  Note: In production, you should restrict these policies based on authentication
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  host text NOT NULL,
  status text DEFAULT 'offline',
  os text DEFAULT '',
  cpu_usage numeric DEFAULT 0,
  memory_usage numeric DEFAULT 0,
  disk_usage numeric DEFAULT 0,
  uptime numeric DEFAULT 0,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  monitoring_enabled boolean DEFAULT true,
  auto_heal boolean DEFAULT false
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- For demo purposes, allow public access
-- In production, restrict based on auth.uid()
CREATE POLICY "Allow public read access to clients"
  ON clients
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to clients"
  ON clients
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to clients"
  ON clients
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to clients"
  ON clients
  FOR DELETE
  TO public
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_last_seen ON clients(last_seen DESC);