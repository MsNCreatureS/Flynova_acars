# Guide de Démarrage Rapide - FlyNova ACARS Tracker

## 🎯 Étapes pour démarrer

### 1. Configuration de l'API Backend

Avant de lancer le tracker, vous devez avoir votre serveur backend FlyNova configuré.

#### Option A : Backend existant
Si vous avez déjà le backend FlyNova :
1. Ouvrir le fichier `api-endpoints-example.js`
2. Copier les routes dans votre serveur Express
3. Les ajouter dans votre fichier de routes principal

Exemple dans votre `server.js` ou `index.js` :
```javascript
const acarsRoutes = require('./routes/acars-routes');
app.use('/api', acarsRoutes);
```

#### Option B : Serveur de test rapide
Pour tester rapidement, créez un serveur minimal :

1. Dans le dossier de votre backend, créer `test-server.js` :
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Importer les routes ACARS
const acarsRoutes = require('./tracker-electron/api-endpoints-example.js');
app.use('/api', acarsRoutes);

app.listen(3001, () => {
  console.log('🚀 FlyNova ACARS API running on http://localhost:3001');
});
```

2. Lancer le serveur :
```bash
node test-server.js
```

### 2. Configuration du Tracker

1. Ouvrir `src/services/api.js`
2. Vérifier que l'URL correspond à votre serveur :
```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

### 3. Lancer le Tracker

```bash
cd tracker-electron
npm start
```

## 🧪 Mode Test (Sans Simulateur)

Le tracker inclut un **mode simulation** qui permet de tester sans avoir de simulateur installé.

### Comment fonctionne le mode simulation :
1. Connectez-vous avec vos identifiants
2. Le tracker détecte qu'aucun simulateur n'est actif
3. Active automatiquement le mode simulation
4. Simule un vol complet de 120 minutes
5. Génère des données réalistes (altitude, vitesse, phases, etc.)

### Phases simulées :
- ✈️ **0-5%** : Taxi au départ
- ✈️ **5-15%** : Décollage et montée jusqu'à 35,000ft
- ✈️ **15-80%** : Croisière à 35,000ft
- ✈️ **80-95%** : Descente
- ✈️ **95-100%** : Atterrissage et taxi à l'arrivée

## 📝 Créer un Vol de Test

### Dans votre base de données MySQL :

```sql
-- 1. Créer un utilisateur de test (si pas encore fait)
INSERT INTO users (email, username, password_hash, first_name, last_name, status)
VALUES (
  'test@flynova.com',
  'testpilot',
  '$2b$10$YourHashedPasswordHere', -- Utiliser bcrypt pour hasher
  'Test',
  'Pilot',
  'active'
);

-- 2. Créer une VA de test (si pas encore fait)
INSERT INTO virtual_airlines (name, callsign, icao_code, owner_id, logo_url, description, primary_color, secondary_color, accent_color)
VALUES (
  'FlyNova Airlines',
  'FLY',
  'FLY',
  1, -- ID de l'utilisateur créé ci-dessus
  'http://localhost:3000/uploads/logos/flynova.png',
  'Virtual Airline de test',
  '#00c853',
  '#00a843',
  '#00ff7f'
);

-- 3. Ajouter le pilote à la VA
INSERT INTO va_members (user_id, va_id, role, status)
VALUES (1, 1, 'Pilot', 'active');

-- 4. Créer une route
INSERT INTO va_routes (va_id, flight_number, route_type, departure_icao, departure_name, arrival_icao, arrival_name, aircraft_type, status)
VALUES (
  1,
  'FLY001',
  'Civil',
  'LFPG',
  'Paris Charles de Gaulle',
  'KJFK',
  'New York JFK',
  'B777-300ER',
  'active'
);

-- 5. Créer une réservation de vol
INSERT INTO flights (user_id, va_id, route_id, flight_number, status)
VALUES (
  1, -- ID utilisateur
  1, -- ID VA
  1, -- ID route
  'FLY001',
  'reserved'
);
```

## 🎮 Test Complet - Étape par Étape

### Étape 1 : Connexion
1. Lancer le tracker : `npm start`
2. Entrer les identifiants :
   - Username : `testpilot`
   - Password : `votre_mot_de_passe`
3. Cliquer sur "Se connecter"

### Étape 2 : Visualisation de la Réservation
- L'interface affiche :
  - ✅ Logo de la VA
  - ✅ Nom de la VA
  - ✅ Numéro de vol (FLY001)
  - ✅ Route (LFPG → KJFK)
  - ✅ Type d'appareil (B777-300ER)
  - ✅ Couleurs personnalisées de la VA

### Étape 3 : Démarrer le Vol
1. Cliquer sur "🛫 Démarrer le vol"
2. Confirmer dans la popup
3. Observer :
   - Le statut passe à "En cours"
   - La barre de progression apparaît
   - Le bouton change pour "🛬 Terminer le vol"

### Étape 4 : Observer la Progression
En mode simulation, vous verrez :
- 📊 Barre de progression qui augmente automatiquement
- ✈️ Phases de vol qui changent :
  - Preflight → Taxi → Takeoff → Climb → Cruise → Descent → Approach → Landing → Arrived
- 📈 Pourcentage de progression mis à jour

### Étape 5 : Terminer le Vol
1. Attendre que le vol atteigne 100% (ou cliquer plus tôt)
2. Cliquer sur "🛬 Terminer le vol"
3. Confirmer
4. Observer :
   - Message de succès
   - Points attribués
   - Rechargement de la page

### Étape 6 : Vérifier dans la BDD
```sql
-- Vérifier le rapport de vol
SELECT * FROM flight_reports ORDER BY id DESC LIMIT 1;

-- Vérifier les stats du pilote
SELECT points, total_flights, total_hours 
FROM va_members 
WHERE user_id = 1 AND va_id = 1;

-- Vérifier le statut du vol
SELECT status, departure_time, arrival_time 
FROM flights 
WHERE id = 1;
```

## 🚨 Dépannage Rapide

### Problème : "Aucune réservation active"
**Solution :**
1. Vérifier qu'un vol existe avec `status = 'reserved'` dans la table `flights`
2. Vérifier que `user_id` correspond à l'utilisateur connecté
3. Vérifier la requête SQL dans la console backend

### Problème : "Erreur de connexion"
**Solution :**
1. Vérifier que le backend est démarré (`http://localhost:3001`)
2. Tester l'endpoint : `http://localhost:3001/api/auth/login`
3. Vérifier les CORS dans le serveur Express
4. Checker la console du navigateur (F12)

### Problème : "Token invalide"
**Solution :**
1. Se déconnecter et reconnecter
2. Vérifier la variable `JWT_SECRET` dans le backend
3. Vérifier l'expiration du token (7 jours par défaut)

### Problème : Logo/Couleurs ne s'affichent pas
**Solution :**
1. Vérifier que `logo_url` est une URL valide
2. Vérifier les couleurs hexadécimales (`#RRGGBB`)
3. Activer la console développeur pour voir les erreurs

## 📱 Raccourcis Clavier

- `F12` : Ouvrir DevTools
- `Ctrl+R` : Recharger l'application
- `Ctrl+Q` : Quitter l'application

## 🔄 Workflow Complet

```
1. Créer une réservation sur le site web FlyNova
   ↓
2. Ouvrir le tracker ACARS
   ↓
3. Se connecter avec ses identifiants
   ↓
4. Vérifier les détails du vol réservé
   ↓
5. Démarrer le simulateur (MSFS/X-Plane/P3D)
   ou utiliser le mode simulation
   ↓
6. Cliquer sur "Démarrer le vol"
   ↓
7. Effectuer le vol (tracking automatique)
   ↓
8. Cliquer sur "Terminer le vol"
   ↓
9. Rapport envoyé + Points attribués
   ↓
10. Voir les stats mises à jour sur le site web
```

## 📊 Données Envoyées au Backend

```json
{
  "flight_id": 1,
  "actual_departure_time": "2025-10-23T18:30:00Z",
  "actual_arrival_time": "2025-10-23T20:45:00Z",
  "flight_duration": 135,
  "distance_flown": "5837.42",
  "fuel_used": "45.23",
  "landing_rate": "-234.56",
  "telemetry_data": {
    "max_altitude": 35000,
    "max_speed": 450,
    "telemetry_points": [...]
  }
}
```

## 🎯 Prochaines Étapes

1. **Intégrer SimConnect** pour MSFS/P3D réel
2. **Intégrer UDP** pour X-Plane réel
3. **Ajouter une carte** pour visualiser le vol
4. **Créer des graphiques** de performance
5. **Implémenter SimBrief** pour les plans de vol

---

**Bon vol ! ✈️**
