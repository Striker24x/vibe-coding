# Monitoring Dashboard - Setup Guide

## Voraussetzungen

- Node.js (v18 oder höher)
- MongoDB Datenbank (bereits konfiguriert)

## Installation & Start

### Option 1: Alles zusammen starten (Empfohlen)

```bash
npm install
npm run dev
```

Dies startet automatisch:
- Frontend auf `http://localhost:5173`
- Backend auf `http://localhost:3000`

### Option 2: Manuell starten

**Terminal 1 - Backend starten:**
```bash
cd backend
npm install
npm start
```

**Terminal 2 - Frontend starten:**
```bash
npm install
npm run dev:frontend
```

## Konfiguration

Die MongoDB-Verbindung ist bereits in `/backend/.env` konfiguriert:
```
MONGODB_URI=mongodb://mongo:aeBxxAgveMMqllQPnSiafEzjieyuxCpf@nozomi.proxy.rlwy.net:14213
PORT=3000
```

## Verwendung

1. Öffnen Sie `http://localhost:5173` im Browser
2. Klicken Sie auf "Client hinzufügen"
3. Geben Sie die Client-Daten ein
4. Der Client wird automatisch in MongoDB gespeichert

## Deployment auf Vercel

### Frontend (Vercel)
1. Verbinden Sie Ihr GitHub-Repository mit Vercel
2. Setzen Sie die Build-Konfiguration:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Backend
Das Backend muss separat gehostet werden (z.B. Railway, Render, Heroku)

Fügen Sie diese Umgebungsvariable in Ihrer Backend-Deployment-Plattform hinzu:
```
MONGODB_URI=mongodb://mongo:aeBxxAgveMMqllQPnSiafEzjieyuxCpf@nozomi.proxy.rlwy.net:14213
```

Dann aktualisieren Sie im Frontend die `VITE_API_URL` Umgebungsvariable in Vercel auf die URL Ihres Backend-Deployments.

## Troubleshooting

**Problem:** "Failed to fetch" / "ERR_CONNECTION_REFUSED"
**Lösung:** Stellen Sie sicher, dass das Backend läuft (`npm run dev` oder starten Sie das Backend manuell)

**Problem:** Clients werden nicht gespeichert
**Lösung:** Überprüfen Sie die MongoDB-Verbindung in `/backend/.env`
