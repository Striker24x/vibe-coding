/*
  # Create Spooler Webhook Configuration Table

  1. New Tables
    - `spooler_webhook_config`
      - `id` (uuid, primary key) - Unique identifier
      - `service_id` (text) - Service identifier (spooler)
      - `start_webhook_url` (text) - URL for start webhook
      - `start_webhook_enabled` (boolean) - Whether start webhook is enabled
      - `stop_webhook_url` (text) - URL for stop webhook
      - `stop_webhook_enabled` (boolean) - Whether stop webhook is enabled
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `spooler_webhook_config` table
    - Add policy for public access (since no authentication is implemented)

  3. Important Notes
    - This table stores only webhook configuration for Print Spooler start/stop buttons
    - Other website data remains in localStorage
    - Single row per service_id
*/

CREATE TABLE IF NOT EXISTS spooler_webhook_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text UNIQUE NOT NULL,
  start_webhook_url text DEFAULT '',
  start_webhook_enabled boolean DEFAULT false,
  stop_webhook_url text DEFAULT '',
  stop_webhook_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE spooler_webhook_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to spooler webhook config"
  ON spooler_webhook_config
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to spooler webhook config"
  ON spooler_webhook_config
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to spooler webhook config"
  ON spooler_webhook_config
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_spooler_webhook_config_service_id 
  ON spooler_webhook_config(service_id);
