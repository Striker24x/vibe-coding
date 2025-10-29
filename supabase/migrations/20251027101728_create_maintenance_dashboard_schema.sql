/*
  # Maintenance Dashboard Schema

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `name` (text) - Service name
      - `display_name` (text) - Human-readable service name
      - `status` (text) - Running, Stopped, Paused
      - `cpu_usage` (numeric) - CPU percentage
      - `memory_usage` (numeric) - Memory in MB
      - `disk_io` (numeric) - Disk I/O in MB/s
      - `network_stats` (numeric) - Network in KB/s
      - `uptime` (bigint) - Uptime in seconds
      - `last_restart` (timestamptz) - Last restart timestamp
      - `error_count` (integer) - Error count in last 24 hours
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `service_logs`
      - `id` (uuid, primary key)
      - `service_id` (uuid, foreign key)
      - `level` (text) - INFO, WARNING, ERROR, CRITICAL
      - `message` (text) - Log message
      - `timestamp` (timestamptz)

    - `workflow_history`
      - `id` (uuid, primary key)
      - `service_id` (uuid, foreign key)
      - `problem_identified` (text)
      - `commands_executed` (jsonb) - Array of executed commands
      - `resolution_status` (text) - success, failed, in_progress
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)

    - `dashboard_config`
      - `id` (uuid, primary key)
      - `n8n_webhook_url` (text)
      - `ssh_host` (text)
      - `ssh_port` (integer)
      - `alert_threshold_cpu` (integer)
      - `alert_threshold_memory` (integer)
      - `monitoring_interval` (integer) - Seconds
      - `auto_healing_enabled` (boolean)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage all data
*/

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_name text NOT NULL,
  status text NOT NULL DEFAULT 'Stopped',
  cpu_usage numeric DEFAULT 0,
  memory_usage numeric DEFAULT 0,
  disk_io numeric DEFAULT 0,
  network_stats numeric DEFAULT 0,
  uptime bigint DEFAULT 0,
  last_restart timestamptz DEFAULT now(),
  error_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read for anonymous users"
  ON services FOR SELECT
  TO anon
  USING (true);

-- Service logs table
CREATE TABLE IF NOT EXISTS service_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  level text NOT NULL,
  message text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE service_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users on logs"
  ON service_logs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read for anonymous users on logs"
  ON service_logs FOR SELECT
  TO anon
  USING (true);

-- Workflow history table
CREATE TABLE IF NOT EXISTS workflow_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  problem_identified text NOT NULL,
  commands_executed jsonb DEFAULT '[]'::jsonb,
  resolution_status text NOT NULL DEFAULT 'in_progress',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE workflow_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users on workflow"
  ON workflow_history FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read for anonymous users on workflow"
  ON workflow_history FOR SELECT
  TO anon
  USING (true);

-- Dashboard configuration table
CREATE TABLE IF NOT EXISTS dashboard_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  n8n_webhook_url text DEFAULT '',
  ssh_host text DEFAULT '',
  ssh_port integer DEFAULT 22,
  alert_threshold_cpu integer DEFAULT 80,
  alert_threshold_memory integer DEFAULT 85,
  monitoring_interval integer DEFAULT 5,
  auto_healing_enabled boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE dashboard_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users on config"
  ON dashboard_config FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read for anonymous users on config"
  ON dashboard_config FOR SELECT
  TO anon
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_logs_service_id ON service_logs(service_id);
CREATE INDEX IF NOT EXISTS idx_service_logs_timestamp ON service_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_history_service_id ON workflow_history(service_id);
CREATE INDEX IF NOT EXISTS idx_workflow_history_started_at ON workflow_history(started_at DESC);

-- Insert default configuration
INSERT INTO dashboard_config (id, n8n_webhook_url, ssh_host, ssh_port, alert_threshold_cpu, alert_threshold_memory, monitoring_interval, auto_healing_enabled)
VALUES ('00000000-0000-0000-0000-000000000001', '', 'localhost', 22, 80, 85, 5, true)
ON CONFLICT (id) DO NOTHING;