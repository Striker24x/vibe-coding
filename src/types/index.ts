export interface Client {
  id: string;
  name: string;
  ip_address: string;
  operating_system: 'Windows' | 'Linux' | 'macOS';
  monitoring_template: MonitoringTemplate;
  status: 'online' | 'offline' | 'warning';
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export interface MonitoringTemplate {
  cpu: boolean;
  gpu: boolean;
  ram: boolean;
  drives: boolean;
  services: boolean;
  network: boolean;
  processes: boolean;
}

export interface Service {
  id: string;
  client_id: string;
  name: string;
  display_name: string;
  status: 'Running' | 'Stopped' | 'Paused';
  cpu_usage: number;
  memory_usage: number;
  disk_io: number;
  network_stats: number;
  uptime: number;
  last_restart: string;
  error_count: number;
  webhook_url?: string;
  webhook_enabled?: boolean;
  start_webhook_url?: string;
  start_webhook_enabled?: boolean;
  stop_webhook_url?: string;
  stop_webhook_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemMetrics {
  id: string;
  client_id: string;
  cpu_usage: number;
  gpu_usage?: number;
  ram_usage: number;
  ram_total: number;
  drives: DriveInfo[];
  network_upload: number;
  network_download: number;
  timestamp: string;
}

export interface DriveInfo {
  name: string;
  total: number;
  used: number;
  free: number;
  percentage: number;
}

export interface ServiceLog {
  id: string;
  service_id: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  timestamp: string;
}

export interface WorkflowHistory {
  id: string;
  service_id: string | null;
  problem_identified: string;
  commands_executed: string[];
  resolution_status: 'success' | 'failed' | 'in_progress';
  started_at: string;
  completed_at: string | null;
}

export interface DashboardConfig {
  id: string;
  n8n_webhook_url: string;
  ssh_host: string;
  ssh_port: number;
  alert_threshold_cpu: number;
  alert_threshold_memory: number;
  monitoring_interval: number;
  auto_healing_enabled: boolean;
  updated_at: string;
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: string;
}
