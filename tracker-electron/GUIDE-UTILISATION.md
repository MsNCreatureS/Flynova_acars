# 🎮 Guide d'utilisation - Tracker ACARS

## ⚠️ IMPORTANT : Mode Simulation Désactivé

Le mode simulation a été **supprimé**. Le tracker nécessite maintenant un **vrai simulateur** pour fonctionner.

## ✈️ Prérequis OBLIGATOIRES

Avant de démarrer un vol dans le tracker, vous DEVEZ :

### Pour MSFS 2020 :

1. ✅ **Lancer Microsoft Flight Simulator 2020**
2. ✅ **Charger un vol** (n'importe quel avion/aéroport)
3. ✅ **Être dans le cockpit** (pas au menu principal)
4. ✅ **Attendre la fin du chargement** (écran de loading terminé)

### Pour X-Plane (bientôt disponible) :

1. ✅ Lancer X-Plane
2. ✅ Charger un vol
3. ✅ Activer la sortie UDP (Data Output)

### Pour P3D (bientôt disponible) :

1. ✅ Lancer Prepar3D
2. ✅ Charger un vol
3. ✅ SimConnect doit être actif

---

## 🚀 Procédure de démarrage

### 1. Préparer le simulateur

```
📋 CHECKLIST AVANT VOL :
□ MSFS est lancé
□ Vol chargé (dans le cockpit)
□ Avion au parking, moteurs éteints
□ Aucune pause active
```

### 2. Lancer le tracker

```powershell
cd C:\wamp64\www\Flynova_acars\tracker-electron
npm start
```

### 3. Se connecter

- Entrez vos identifiants FlyNova
- Vérifiez qu'une réservation s'affiche

### 4. Démarrer le vol

**IMPORTANT :** Cliquez sur "🛫 Démarrer le vol" **UNIQUEMENT** quand :

- ✅ MSFS est en marche
- ✅ Vous êtes dans le cockpit
- ✅ Vous êtes prêt à voler

---

## ✅ Connexion réussie

Si tout est OK, vous verrez dans la console (F12) :

```
Starting flight tracker...
🔌 Connecting to MSFS SimConnect...
✅ Connected to Microsoft Flight Simulator
✅ SimConnect data definitions configured
✅ Successfully connected to MSFS via SimConnect
✅ Connected to MSFS
```

Le tracker commence alors à collecter les données :
- Position GPS
- Altitude
- Vitesse
- Cap
- Carburant
- etc.

---

## ❌ Erreurs courantes

### "Aucun simulateur détecté"

**Causes possibles :**

1. ❌ MSFS n'est pas lancé
2. ❌ Vous êtes au menu principal (pas en vol)
3. ❌ Le vol n'a pas fini de charger
4. ❌ MSFS est en pause
5. ❌ SimConnect n'est pas installé

**Solution :**

```
1. Fermez le tracker
2. Lancez MSFS
3. Chargez un vol COMPLÈTEMENT
4. Attendez d'être dans le cockpit
5. Relancez le tracker
6. Cliquez sur "Démarrer le vol"
```

### "SimConnect module not available"

**Solution :**

```powershell
# Réinstaller node-simconnect
cd C:\wamp64\www\Flynova_acars\tracker-electron
npm install node-simconnect
```

Si ça ne marche toujours pas, vous devez installer Visual Studio Build Tools :
- Voir `SIMCONNECT-INSTALL.md`

### Le tracker dit "Démarrage..." et reste bloqué

**Solution :**

1. Fermez le tracker (Alt+F4)
2. Vérifiez que MSFS tourne et est en vol
3. Relancez le tracker
4. Réessayez

Si le problème persiste :
- Redémarrez MSFS
- Redémarrez votre PC

---

## 📊 Données collectées

Le tracker récupère toutes les secondes :

| Donnée | Unité | Utilisation |
|--------|-------|-------------|
| Latitude | degrés | Position GPS |
| Longitude | degrés | Position GPS |
| Altitude | pieds | Altitude vraie |
| Altitude indiquée | pieds | Affichage |
| Vitesse sol | knots | Calcul distance |
| Vitesse indiquée | knots | IAS |
| Cap | degrés | Direction |
| Vitesse verticale | fpm | Montée/descente |
| Au sol | bool | Détection phases |
| Carburant | % | Consommation |

---

## 🎯 Phases de vol détectées

Le tracker détecte automatiquement :

1. **Preflight** - Au parking, moteurs off
2. **Taxi** - Roulage (< 80 kts au sol)
3. **Takeoff** - Décollage
4. **Climb** - Montée vers altitude de croisière
5. **Cruise** - Croisière (altitude stable)
6. **Descent** - Descente
7. **Approach** - Approche finale
8. **Landing** - Atterrissage ⚠️ Landing rate capturé !
9. **Taxi to Gate** - Roulage vers parking
10. **Arrived** - Arrivé, moteurs off

---

## 📈 Rapport de vol

À la fin du vol, le tracker génère automatiquement :

- ⏱️ Durée totale
- 📏 Distance parcourue
- ⛽ Carburant utilisé
- 🛬 Landing rate (qualité atterrissage)
- 📊 Altitude max
- 🚀 Vitesse max
- ⭐ **Points gagnés** (basés sur le landing rate)

---

## 💡 Conseils

### Pour un bon vol :

1. ✅ Planifiez votre vol (SimBrief recommandé)
2. ✅ Configurez l'avion correctement (fuel, payload)
3. ✅ Respectez les procédures IFR/VFR
4. ✅ Faites un atterrissage en douceur (< 200 fpm = max points)

### Landing rate :

- **< 100 fpm** = 🏆 Excellent ! (max points)
- **100-200 fpm** = ✅ Bon
- **200-300 fpm** = ⚠️ Acceptable
- **> 300 fpm** = ❌ Dur (peu de points)
- **> 600 fpm** = 💥 Crash !

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. 📖 Consultez `TROUBLESHOOTING.md`
2. 📖 Consultez `SIMCONNECT-INSTALL.md`
3. 🔍 Regardez la console (F12) pour les erreurs
4. 🔧 Vérifiez que le backend tourne (`npm run dev` dans FlyNova_V2/backend)

---

## 🎮 C'est parti !

Vous êtes maintenant prêt à voler avec le tracker ACARS FlyNova !

**Bon vol et atterrissage en douceur ! ✈️**
