/*
  # Add Service-Specific Webhook Configuration

  1. Changes
    - Add `webhook_url` column to `services` table for service-specific webhook URLs
    - Add `webhook_enabled` column to enable/disable webhooks per service
    - Add index for faster webhook lookups

  2. Purpose
    - Allow each service to have its own webhook URL
    - Enable direct trigger buttons for specific services like Print Spooler
*/

-- Add webhook columns to services table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'webhook_url'
  ) THEN
    ALTER TABLE services ADD COLUMN webhook_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'webhook_enabled'
  ) THEN
    ALTER TABLE services ADD COLUMN webhook_enabled boolean DEFAULT false;
  END IF;
END $$;

-- Create index for webhook-enabled services
CREATE INDEX IF NOT EXISTS idx_services_webhook_enabled ON services(webhook_enabled) WHERE webhook_enabled = true;