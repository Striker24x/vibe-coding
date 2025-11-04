# Monitoring Backend

Node.js/Express backend with MongoDB for monitoring application.

## Railway Deployment

1. Install dependencies:
```bash
npm install
```

2. Set environment variables in Railway:
- `MONGODB_URI`: mongodb://mongo:aeBxxAgveMMqllQPnSiafEzjieyuxCpf@nozomi.proxy.rlwy.net:14213
- `PORT`: 3000 (or Railway will set automatically)

3. Start command: `npm start`

## API Endpoints

- `GET /health` - Health check
- `POST /api/monitoring/data` - Submit monitoring data
- `GET /api/monitoring/data/latest` - Get latest monitoring data
- `GET /api/monitoring/services` - Get all services
- `POST /api/monitoring/services` - Create service
- `PUT /api/monitoring/services/:id` - Update service
- `GET /api/monitoring/logs` - Get logs
- `POST /api/monitoring/logs` - Create log entry
- `GET /api/monitoring/workflows` - Get workflows
- `POST /api/monitoring/workflows` - Create workflow
- `GET /api/monitoring/config` - Get webhook config
- `POST /api/monitoring/config` - Update webhook config
