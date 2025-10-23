# Test SimConnect avec MSFS 2020

## Prérequis

1. ✅ **node-simconnect installé** (déjà fait)
2. ✅ **SimConnect SDK installé** (vérifié dans SIMCONNECT-INSTALL.md)
3. 🛫 **Microsoft Flight Simulator 2020 lancé**

## Étapes de test

### 1. Lancer MSFS 2020

- Démarrez Microsoft Flight Simulator
- Chargez un vol (n'importe quel avion, n'importe où)
- Une fois dans le cockpit, laissez le jeu tourner

### 2. Lancer le tracker ACARS

```powershell
cd C:\wamp64\www\Flynova_acars\tracker-electron
npm start
```

### 3. Se connecter

- Utilisez vos identifiants FlyNova
- Vérifiez qu'une réservation active s'affiche

### 4. Démarrer le vol

- Cliquez sur **"Start Flight"**
- Le tracker va automatiquement détecter MSFS via SimConnect

### 5. Vérifier la connexion

Dans la console du tracker, vous devriez voir :
```
Starting flight tracker...
Trying MSFS connection...
Successfully connected to MSFS via SimConnect
Connected to MSFS
```

Si vous voyez plutôt :
```
MSFS not detected
No simulator detected, using simulation mode
```
→ Vérifiez les étapes de dépannage ci-dessous

## Données collectées

Le tracker récupère en temps réel :

- ✈️ **Position GPS** (latitude, longitude)
- 📏 **Altitude** (pieds)
- 🏃 **Vitesse sol** (knots)
- 🧭 **Cap** (degrés)
- ⬆️ **Vitesse verticale** (fpm)
- 🛬 **Au sol ou en vol**
- ⛽ **Carburant** (%)

## Test des phases de vol

1. **Preflight** - Avion au parking, moteurs éteints
2. **Taxi** - Roulage au sol (< 80 kts)
3. **Takeoff** - Décollage (montée < 10000 ft)
4. **Climb** - Montée (> 10000 ft)
5. **Cruise** - Croisière (altitude stable)
6. **Descent** - Descente (VS < -500 fpm)
7. **Approach** - Approche finale (< 5000 ft, descente)
8. **Landing** - Atterrissage (toucher des roues)
9. **Taxi to Gate** - Roulage vers le parking
10. **Arrived** - Arrivé, moteurs coupés

## Dépannage

### ❌ "MSFS not detected"

**Solution 1 : Vérifier MSFS**
- MSFS doit être **lancé ET en vol** (pas juste au menu principal)
- Attendez que le chargement du vol soit complètement terminé

**Solution 2 : Vérifier SimConnect SDK**
```powershell
# Vérifier si le fichier SimConnect.dll existe
Test-Path "C:\MSFS SDK\SimConnect SDK\lib\SimConnect.dll"
```
Si False → Réinstallez le SDK (voir SIMCONNECT-INSTALL.md)

**Solution 3 : Relancer MSFS**
- Fermez complètement MSFS
- Relancez le jeu
- Chargez un vol
- Relancez le tracker

**Solution 4 : Vérifier les droits admin**
- Lancez le tracker en tant qu'administrateur si nécessaire

**Solution 5 : Utiliser le mode WebSocket (alternative)**
Si le module natif ne fonctionne pas, vous pouvez utiliser un bridge WebSocket :

1. Téléchargez FSUIPC7 ou Mobiflight Connector
2. Activez le serveur WebSocket
3. Le tracker se connectera automatiquement via WebSocket

### ❌ "Error getting MSFS data"

- MSFS s'est peut-être fermé
- Vérifiez que le jeu tourne toujours
- Redémarrez le vol dans le tracker

### ❌ Données incohérentes

- Attendez quelques secondes (initialisation)
- Vérifiez que vous êtes bien en vol (pas en pause/menu)

## Mode simulation (fallback)

Si SimConnect ne fonctionne pas, le tracker bascule automatiquement en **mode simulation** :

```
No simulator detected, using simulation mode
```

Cela vous permet de tester l'application sans MSFS :
- Données de vol simulées
- Progression automatique sur 2 heures
- Phases de vol complètes
- Idéal pour tester l'interface et le backend

## Vérification télémétrie

Pendant le vol, ouvrez la console développeur (F12) et vérifiez :

```javascript
// Toutes les 30 secondes, vous devriez voir :
Sending telemetry: {
  flight_id: 123,
  latitude: 48.xxxx,
  longitude: 2.xxxx,
  altitude: 35000,
  ground_speed: 450,
  heading: 180,
  vertical_speed: 0,
  on_ground: false,
  fuel: 65,
  phase: "Cruise"
}
```

## Tests recommandés

### Test 1 : Vol court (15 min)
- Départ : N'importe où
- Arrivée : Aéroport proche
- Vérifiez toutes les phases

### Test 2 : Landing rate
- Faites un atterrissage en douceur (< 200 fpm)
- Vérifiez le score de points à la fin

### Test 3 : Vol complet
- Vol de 1h+ avec croisière
- Vérifiez les stats finales (distance, fuel, duration)

## Résultat attendu

À la fin du vol, le rapport devrait contenir :

```json
{
  "departure_time": "2024-01-15 10:30:00",
  "arrival_time": "2024-01-15 12:45:00",
  "duration": 135,
  "distance": 450,
  "fuel_used": 2500,
  "landing_rate": 150,
  "max_altitude": 37000,
  "max_speed": 480,
  "points": 250,
  "telemetry": [...]
}
```

## Support

Si vous rencontrez des problèmes :

1. Vérifiez `TROUBLESHOOTING.md`
2. Vérifiez `SIMCONNECT-INSTALL.md`
3. Consultez les logs de la console (F12)
4. Vérifiez que le backend est lancé (`npm run dev` dans FlyNova_V2/backend)

---

🎮 **Bon vol !** Profitez de votre tracker ACARS avec de vraies données MSFS !
