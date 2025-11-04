import { Service, ServiceLog } from '../types';

const WINDOWS_SERVICES = [
  { name: 'wuauserv', display_name: 'Windows Update' },
  { name: 'spooler', display_name: 'Print Spooler' },
  { name: 'W32Time', display_name: 'Windows Time' },
  { name: 'EventLog', display_name: 'Windows Event Log' },
  { name: 'Dnscache', display_name: 'DNS Client' },
  { name: 'MSSQLSERVER', display_name: 'SQL Server' },
  { name: 'W3SVC', display_name: 'IIS Admin Service' },
  { name: 'BITS', display_name: 'Background Intelligent Transfer Service' },
  { name: 'Schedule', display_name: 'Task Scheduler' },
  { name: 'Winmgmt', display_name: 'Windows Management Instrumentation' },
  { name: 'WSearch', display_name: 'Windows Search' },
  { name: 'CryptSvc', display_name: 'Cryptographic Services' },
];

const LOG_MESSAGES = {
  INFO: [
    'Service started successfully',
    'Health check passed',
    'Configuration loaded',
    'Connection established',
    'Task completed',
    'Backup created successfully',
    'Database synchronized',
    'Cache cleared',
  ],
  WARNING: [
    'High memory usage detected',
    'Response time degraded',
    'Retry attempt initiated',
    'Connection timeout, retrying',
    'Cache miss rate elevated',
    'Queue size growing',
    'Disk space running low',
  ],
  ERROR: [
    'Failed to connect to database',
    'Service restart required',
    'Authentication failed',
    'Configuration error detected',
    'Network connection lost',
    'Resource allocation failed',
    'Access denied to resource',
  ],
  CRITICAL: [
    'Service crashed unexpectedly',
    'Data corruption detected',
    'Security breach attempt',
    'System resources exhausted',
    'Fatal exception occurred',
    'Emergency shutdown initiated',
  ],
};

export function generateMockServices(count: number = 12, clientId: string = 'default-client'): Service[] {
  const services: Service[] = [];
  const now = Date.now();

  for (let i = 0; i < Math.min(count, WINDOWS_SERVICES.length); i++) {
    const statusRand = Math.random();
    const status =
      statusRand > 0.85 ? 'Stopped' : statusRand > 0.80 ? 'Paused' : 'Running';

    const isHealthy = Math.random() > 0.3;

    services.push({
      id: `service-${i}`,
      client_id: clientId,
      name: WINDOWS_SERVICES[i].name,
      display_name: WINDOWS_SERVICES[i].display_name,
      status,
      cpu_usage: isHealthy ? Math.random() * 30 : 60 + Math.random() * 40,
      memory_usage: isHealthy ? 100 + Math.random() * 500 : 800 + Math.random() * 1200,
      disk_io: Math.random() * 50,
      network_stats: Math.random() * 1000,
      uptime: status === 'Running' ? Math.floor(Math.random() * 86400 * 7) : 0,
      last_restart: new Date(now - Math.random() * 86400000 * 7).toISOString(),
      error_count: isHealthy ? Math.floor(Math.random() * 5) : Math.floor(5 + Math.random() * 20),
      created_at: new Date(now - 86400000 * 30).toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  return services;
}

export function generateMockLog(serviceId?: string): ServiceLog {
  const levels: Array<'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'> = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];
  const weights = [0.6, 0.25, 0.12, 0.03];

  const rand = Math.random();
  let level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL' = 'INFO';
  let cumWeight = 0;

  for (let i = 0; i < weights.length; i++) {
    cumWeight += weights[i];
    if (rand < cumWeight) {
      level = levels[i];
      break;
    }
  }

  const messages = LOG_MESSAGES[level];
  const message = messages[Math.floor(Math.random() * messages.length)];

  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    service_id: serviceId || `service-${Math.floor(Math.random() * 12)}`,
    level,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function updateServiceMetrics(service: Service): Partial<Service> {
  const isHealthy = service.error_count < 10;
  const variance = 0.1;

  return {
    cpu_usage: Math.max(
      0,
      Math.min(
        100,
        service.cpu_usage + (Math.random() - 0.5) * variance * 20
      )
    ),
    memory_usage: Math.max(
      50,
      service.memory_usage + (Math.random() - 0.5) * variance * 100
    ),
    disk_io: Math.max(
      0,
      service.disk_io + (Math.random() - 0.5) * variance * 10
    ),
    network_stats: Math.max(
      0,
      service.network_stats + (Math.random() - 0.5) * variance * 200
    ),
    uptime: service.status === 'Running' ? service.uptime + 5 : 0,
  };
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes.toFixed(0)} MB`;
  return `${(bytes / 1024).toFixed(2)} GB`;
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}
