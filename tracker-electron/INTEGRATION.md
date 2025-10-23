# 🔗 Intégration avec le Site Web FlyNova V2

Ce document explique comment intégrer le tracker ACARS avec votre site web FlyNova existant.

## 📁 Repository GitHub
Le site web est disponible sur : https://github.com/MsNCreatureS/FlyNova_V2

## 🔧 Modifications à Apporter au Backend

### 1. Ajouter les Routes ACARS

Dans votre backend Next.js/Express, créez un nouveau fichier de routes :

**`backend/routes/acars.js`** ou **`app/api/acars/route.ts`**

Copiez le contenu de `api-endpoints-example.js` et adaptez-le à votre structure.

#### Pour Express.js (si backend séparé) :
```javascript
// backend/routes/acars.js
const express = require('express');
const router = express.Router();

// Copier le contenu de api-endpoints-example.js ici

module.exports = router;
```

```javascript
// backend/server.js
const acarsRoutes = require('./routes/acars');
app.use('/api', acarsRoutes);
```

#### Pour Next.js API Routes :
```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  // Copier la logique de login depuis api-endpoints-example.js
}
```

### 2. Configuration CORS

Le tracker Electron fait des requêtes depuis une origine différente. Configurez CORS :

```javascript
// backend/server.js ou middleware
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'file://*'], // Electron
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Pour Next.js :
```typescript
// app/api/[...]/route.ts
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

### 3. Variables d'Environnement

Ajoutez dans votre `.env` :

```env
# ACARS Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
ACARS_ENABLED=true
ACARS_TELEMETRY_ENABLED=true
```

## 🌐 Modifications sur le Site Web

### 1. Lien de Téléchargement du Tracker

Ajoutez un lien pour télécharger le tracker sur la page de profil ou dashboard :

```tsx
// components/DownloadTracker.tsx
export function DownloadTracker() {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-xl font-bold mb-2">📥 FlyNova ACARS Tracker</h3>
      <p className="text-muted-foreground mb-4">
        Téléchargez le tracker pour suivre vos vols en temps réel
      </p>
      <div className="flex gap-4">
        <a 
          href="/downloads/flynova-acars-setup.exe" 
          className="btn btn-primary"
        >
          ⬇️ Windows
        </a>
        <a 
          href="/downloads/flynova-acars.dmg" 
          className="btn btn-secondary"
        >
          ⬇️ macOS
        </a>
      </div>
    </div>
  );
}
```

### 2. Indicateur de Vol en Cours

Affichez si un pilote est actuellement en vol :

```tsx
// components/FlightStatus.tsx
'use client';

import { useEffect, useState } from 'react';

export function FlightStatus({ userId }: { userId: number }) {
  const [flight, setFlight] = useState(null);
  
  useEffect(() => {
    async function checkFlight() {
      const res = await fetch(`/api/flights/active/${userId}`);
      const data = await res.json();
      if (data.success) setFlight(data.flight);
    }
    
    checkFlight();
    const interval = setInterval(checkFlight, 30000); // Check every 30s
    
    return () => clearInterval(interval);
  }, [userId]);
  
  if (!flight || flight.status !== 'in_progress') return null;
  
  return (
    <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <span className="animate-pulse">✈️</span>
        <div>
          <p className="font-bold text-green-500">Vol en cours</p>
          <p className="text-sm">{flight.flight_number}</p>
        </div>
      </div>
    </div>
  );
}
```

### 3. Historique des Vols avec Rapports ACARS

Affichez les rapports détaillés des vols :

```tsx
// components/FlightHistory.tsx
export async function FlightHistory({ userId }: { userId: number }) {
  const flights = await getFlightReports(userId);
  
  return (
    <div className="space-y-4">
      {flights.map(flight => (
        <div key={flight.id} className="bg-card p-4 rounded-lg border">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold">{flight.flight_number}</h4>
              <p className="text-sm text-muted-foreground">
                {flight.departure_icao} → {flight.arrival_icao}
              </p>
            </div>
            <span className={`badge ${
              flight.validation_status === 'approved' ? 'badge-success' :
              flight.validation_status === 'rejected' ? 'badge-error' :
              'badge-warning'
            }`}>
              {flight.validation_status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-muted-foreground">Durée</p>
              <p className="font-semibold">{flight.flight_duration} min</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="font-semibold">{flight.distance_flown} NM</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Atterrissage</p>
              <p className="font-semibold">{flight.landing_rate} fpm</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Points</p>
              <p className="font-semibold text-primary">
                {flight.points_awarded}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 4. Leaderboard avec Points ACARS

```tsx
// app/leaderboard/page.tsx
export default async function Leaderboard({ vaId }: { vaId: number }) {
  const pilots = await getVALeaderboard(vaId);
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">🏆 Classement</h2>
      
      <div className="bg-card rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left">Rang</th>
              <th className="p-4 text-left">Pilote</th>
              <th className="p-4 text-right">Vols</th>
              <th className="p-4 text-right">Heures</th>
              <th className="p-4 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {pilots.map((pilot, index) => (
              <tr key={pilot.id} className="border-t">
                <td className="p-4">
                  {index + 1 <= 3 ? ['🥇', '🥈', '🥉'][index] : `${index + 1}`}
                </td>
                <td className="p-4 font-semibold">{pilot.username}</td>
                <td className="p-4 text-right">{pilot.total_flights}</td>
                <td className="p-4 text-right">{pilot.total_hours.toFixed(1)}</td>
                <td className="p-4 text-right font-bold text-primary">
                  {pilot.points.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

## 📊 Dashboard Admin

Créez une page admin pour gérer les rapports ACARS :

```tsx
// app/admin/flight-reports/page.tsx
export default async function AdminFlightReports() {
  const reports = await getPendingFlightReports();
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">📝 Rapports ACARS en attente</h2>
      
      {reports.map(report => (
        <div key={report.id} className="bg-card p-6 rounded-lg border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg">{report.flight_number}</h3>
              <p className="text-sm text-muted-foreground">
                Par {report.pilot_username} • {report.created_at}
              </p>
            </div>
            <span className="badge badge-warning">En attente</span>
          </div>
          
          {/* Détails du vol */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Durée</p>
              <p>{report.flight_duration} min</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Distance</p>
              <p>{report.distance_flown} NM</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Carburant</p>
              <p>{report.fuel_used} kg</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Atterrissage</p>
              <p className={
                report.landing_rate < 600 ? 'text-green-500' : 'text-orange-500'
              }>
                {report.landing_rate} fpm
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <button 
              onClick={() => approveReport(report.id)}
              className="btn btn-success"
            >
              ✅ Approuver
            </button>
            <button 
              onClick={() => rejectReport(report.id)}
              className="btn btn-error"
            >
              ❌ Rejeter
            </button>
            <button 
              onClick={() => viewTelemetry(report.id)}
              className="btn btn-secondary"
            >
              📊 Voir télémétrie
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Synchronisation en Temps Réel

Pour une expérience encore meilleure, implémentez WebSockets :

```javascript
// backend/websocket.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connecté');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    // Broadcast telemetry to all connected clients
    if (data.type === 'telemetry') {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'flight_update',
            flightId: data.flightId,
            telemetry: data.telemetry
          }));
        }
      });
    }
  });
});
```

## 📱 Notifications

Envoyez des notifications lorsqu'un vol est complété :

```typescript
// lib/notifications.ts
export async function sendFlightCompletedNotification(userId: number, flight: Flight) {
  // Email notification
  await sendEmail({
    to: flight.user.email,
    subject: `Vol ${flight.flight_number} terminé !`,
    html: `
      <h2>Félicitations ! 🎉</h2>
      <p>Votre vol ${flight.flight_number} a été complété avec succès.</p>
      <ul>
        <li>Durée: ${flight.duration} minutes</li>
        <li>Distance: ${flight.distance} NM</li>
        <li>Points gagnés: ${flight.points}</li>
      </ul>
    `
  });
  
  // Push notification (si implémenté)
  await sendPushNotification(userId, {
    title: 'Vol terminé !',
    body: `${flight.flight_number} complété. +${flight.points} points !`,
    icon: '/icons/plane.png'
  });
}
```

## 🎨 Styles Cohérents

Assurez-vous que les couleurs du tracker correspondent au site web.

Dans le tracker, les couleurs sont chargées dynamiquement depuis la BDD.
Sur le site web, utilisez les mêmes couleurs :

```css
/* tailwind.config.ts */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color, #00c853)',
        secondary: 'var(--secondary-color, #00a843)',
        accent: 'var(--accent-color, #00ff7f)',
      }
    }
  }
}
```

## 📚 Documentation API

Documentez votre API avec Swagger ou similaire :

```typescript
// app/api/docs/route.ts
import { generateOpenAPISpec } from '@/lib/openapi';

export async function GET() {
  const spec = generateOpenAPISpec({
    title: 'FlyNova ACARS API',
    version: '1.0.0',
    endpoints: [
      {
        path: '/api/auth/login',
        method: 'POST',
        description: 'Authentification des pilotes',
        // ...
      }
      // ... autres endpoints
    ]
  });
  
  return Response.json(spec);
}
```

## ✅ Checklist d'Intégration

- [ ] Routes ACARS ajoutées au backend
- [ ] CORS configuré pour Electron
- [ ] JWT_SECRET défini dans .env
- [ ] Lien de téléchargement du tracker sur le site
- [ ] Indicateur de vol en cours ajouté
- [ ] Historique des vols ACARS affiché
- [ ] Leaderboard avec points implémenté
- [ ] Page admin pour valider les rapports
- [ ] Notifications configurées
- [ ] Tests effectués avec données de test
- [ ] Documentation API à jour

## 🚀 Déploiement

### Backend
```bash
# Build
npm run build

# Deploy sur Vercel/Railway/autre
vercel deploy --prod
```

### Tracker
```bash
# Build Electron
cd tracker-electron
npm run build

# Les exécutables seront dans dist/
# Uploader sur GitHub Releases ou serveur
```

## 📞 Support

Si vous rencontrez des problèmes lors de l'intégration :
1. Vérifier les logs du backend
2. Vérifier la console du tracker (F12)
3. Tester les endpoints avec Postman
4. Vérifier la connexion BDD

---

**L'intégration est maintenant complète ! 🎉**

Votre système FlyNova dispose d'un tracker ACARS professionnel intégré avec le site web.
