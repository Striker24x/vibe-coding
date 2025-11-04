import { SystemMetrics, DriveInfo } from '../types';

export class DemoDataGenerator {
  private clientId: string;
  private baseValues: {
    cpu: number;
    gpu: number;
    ram: number;
    networkUpload: number;
    networkDownload: number;
  };

  constructor(clientId: string) {
    this.clientId = clientId;
    this.baseValues = {
      cpu: 30 + Math.random() * 20,
      gpu: 20 + Math.random() * 30,
      ram: 40 + Math.random() * 20,
      networkUpload: 1000 + Math.random() * 5000,
      networkDownload: 5000 + Math.random() * 10000,
    };
  }

  private smoothVariation(current: number, min: number, max: number, volatility: number = 5): number {
    const change = (Math.random() - 0.5) * volatility;
    const newValue = current + change;
    return Math.max(min, Math.min(max, newValue));
  }

  generateMetrics(): SystemMetrics {
    this.baseValues.cpu = this.smoothVariation(this.baseValues.cpu, 10, 90);
    this.baseValues.gpu = this.smoothVariation(this.baseValues.gpu, 5, 85);
    this.baseValues.ram = this.smoothVariation(this.baseValues.ram, 30, 85);
    this.baseValues.networkUpload = this.smoothVariation(this.baseValues.networkUpload, 500, 15000, 500);
    this.baseValues.networkDownload = this.smoothVariation(this.baseValues.networkDownload, 2000, 30000, 800);

    const totalRam = 16384;
    const ramUsed = (this.baseValues.ram / 100) * totalRam;

    const drives: DriveInfo[] = [
      {
        name: 'C:',
        total: 512000,
        used: 256000 + Math.random() * 50000,
        free: 0,
        percentage: 0,
      },
      {
        name: 'D:',
        total: 1024000,
        used: 512000 + Math.random() * 100000,
        free: 0,
        percentage: 0,
      },
    ];

    drives.forEach(drive => {
      drive.free = drive.total - drive.used;
      drive.percentage = (drive.used / drive.total) * 100;
    });

    return {
      id: Math.random().toString(36).substr(2, 9),
      client_id: this.clientId,
      cpu_usage: Math.round(this.baseValues.cpu * 10) / 10,
      gpu_usage: Math.round(this.baseValues.gpu * 10) / 10,
      ram_usage: Math.round(ramUsed),
      ram_total: totalRam,
      drives,
      network_upload: Math.round(this.baseValues.networkUpload),
      network_download: Math.round(this.baseValues.networkDownload),
      timestamp: new Date().toISOString(),
    };
  }
}

export function startDemoDataGeneration(
  clientId: string,
  onDataGenerated: (metrics: SystemMetrics) => void,
  interval: number = 2000
): () => void {
  const generator = new DemoDataGenerator(clientId);

  const intervalId = setInterval(() => {
    const metrics = generator.generateMetrics();
    onDataGenerated(metrics);
  }, interval);

  onDataGenerated(generator.generateMetrics());

  return () => clearInterval(intervalId);
}
