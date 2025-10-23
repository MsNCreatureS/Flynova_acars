# Guide de Test Rapide - SimConnect

## État actuel ✅

Le tracker ACARS a été mis à jour avec la vraie API de `node-simconnect` v4.0.0.

## Comment tester

### 1. Sans MSFS (Mode Simulation)

Si MSFS n'est **PAS** lancé, le tracker utilisera automatiquement le **mode simulation** :

```
Starting flight tracker...
⚠️ node-simconnect module loaded
🔌 Connecting to MSFS SimConnect...
❌ SimConnect connection failed: ...
MSFS not detected
...
No simulator detected, using simulation mode
Simulation mode activated
```

✅ **C'est normal !** Le vol fonctionnera en mode test.

### 2. Avec MSFS (Mode Réel)

Pour tester la vraie connexion SimConnect :

1. **Lancez MSFS 2020**
2. **Chargez un vol** (n'importe quel avion/aéroport)
3. **Attendez d'être dans le cockpit** (pas dans le menu)
4. **Lancez le tracker** : `npm start`
5. **Connectez-vous** avec vos identifiants FlyNova
6. **Cliquez sur "Start Flight"**

Vous devriez voir dans la console :

```
Starting flight tracker...
✅ node-simconnect module loaded
🔌 Connecting to MSFS SimConnect...
✅ Connected to Microsoft Flight Simulator
✅ SimConnect data definitions configured
✅ Successfully connected to MSFS via SimConnect
Connected to MSFS
```

## Données en temps réel

Une fois connecté à MSFS, le tracker reçoit automatiquement toutes les secondes :

- 📍 **Position GPS** (latitude, longitude)
- 📏 **Altitude** (pieds)
- 🚀 **Vitesse sol** (knots)
- 🧭 **Cap** (degrés)
- ⬆️ **Vitesse verticale** (fpm)
- 🛬 **Au sol / en vol**
- ⛽ **Carburant** (%)
- 🎯 **Vitesse indiquée** (IAS)

## Dépannage

### ❌ "SimConnect connection failed"

**Vérifiez :**

1. ✈️ MSFS est **lancé ET en vol** (pas juste au menu)
2. ⏳ Le chargement du vol est **complètement terminé**
3. 🔌 MSFS n'est pas en pause
4. 🔄 Redémarrez MSFS si nécessaire

**Note :** Si MSFS n'est pas détecté, le tracker basculera automatiquement en **mode simulation**. Vous pourrez quand même tester l'interface !

### ✅ Mode Simulation (Fallback)

Le mode simulation est **parfait pour tester** :

- ✅ L'interface utilisateur
- ✅ La progression du vol
- ✅ Les phases (taxi, takeoff, climb, cruise, descent, landing)
- ✅ L'envoi de télémétrie au backend
- ✅ La génération de rapports de vol

Il simule un vol complet de 2 heures avec des données réalistes.

## Console développeur (F12)

Pour voir les logs détaillés :

1. Appuyez sur **F12** dans le tracker
2. Allez dans l'onglet **Console**
3. Vous verrez tous les messages :
   - Connexion SimConnect
   - Données reçues
   - Télémétrie envoyée
   - Changements de phase

## Prochaines étapes

Une fois que vous confirmez que la connexion fonctionne :

- [ ] Tester un vol complet de A à Z
- [ ] Vérifier les stats finales (distance, fuel, landing rate)
- [ ] Vérifier le rapport de vol dans la base de données
- [ ] Implémenter X-Plane (UDP)
- [ ] Implémenter P3D (SimConnect)

---

💡 **Astuce :** Le mode simulation est idéal pour développer et tester sans avoir besoin de lancer MSFS à chaque fois !

🎮 **Bon vol !**
