# Monitoring Backend

Node.js/Express backend with MongoDB for monitoring application.

## Railway Deployment

### Step 1: Create MongoDB Database

1. Login to [Railway](https://railway.app)
2. Create a new project
3. Add a MongoDB database:
   - Click "New Service"
   - Select "Database"
   - Choose "MongoDB"
4. Copy the MongoDB connection string from the database service variables

### Step 2: Deploy Backend

1. In the same Railway project, click "New Service"
2. Select "GitHub Repo" and connect your repository
3. Select the backend folder as the root directory
4. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string from Step 1
   - `PORT`: Leave empty (Railway will set automatically)
5. Deploy! Railway will automatically:
   - Install dependencies
   - Start the server with `npm start`
   - Provide a public URL

### Step 3: Connect Frontend

Update your frontend `.env` file with the Railway backend URL:
```
VITE_API_URL=https://your-backend.railway.app
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

3. Start development server:
```bash
npm run dev
```

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
