# 🚀 Guide Rapide - Corrections Apportées

## ✅ Problèmes Résolus

### 1. ✈️ Aircraft Type affiche maintenant le vrai avion
**Avant :** Affichait toujours "N/A"  
**Après :** Affiche le nom réel de l'avion depuis MSFS (ex: "Airbus A320neo FlyByWire")

**Fichiers modifiés :**
- `src/services/simconnect.js` - Ajout de la lecture de TITLE
- `src/services/flight-tracker.js` - Support de aircraftType
- `src/pages/dashboard.html` - Mise à jour dynamique

### 2. 🎮 Discord Rich Presence Ajoutée
**Nouveau :** Affiche votre vol en cours sur Discord avec :
- Numéro de vol et route (ex: FLY001 | LFPG → KJFK)
- Phase de vol (Cruising, Climbing, etc.)
- Altitude et vitesse en temps réel
- Nom de la compagnie virtuelle
- Temps de vol écoulé

**Nouveaux fichiers :**
- `src/services/discord-presence.js` - Service Discord RPC
- `DISCORD-SETUP.md` - Guide de configuration complet

**Fichiers modifiés :**
- `package.json` - Ajout de discord-rpc
- `src/services/flight-tracker.js` - Intégration Discord

## 📦 Installation

```powershell
# Installer les nouvelles dépendances
npm install
```

## 🎯 Pour utiliser Discord Rich Presence

### Configuration Rapide (5 minutes)

1. **Créer une app Discord :**
   - Allez sur https://discord.com/developers/applications
   - Créer "New Application" → "FlyNova ACARS"
   - Copiez le Client ID

2. **Configurer le Client ID :**
   ```javascript
   // Dans src/services/discord-presence.js, ligne 9
   this.clientId = 'VOTRE_CLIENT_ID_ICI';
   ```

3. **Ajouter le logo (optionnel) :**
   - Dans Discord Developer Portal → Rich Presence → Art Assets
   - Upload votre logo (nommez-le `flynova_logo`)

4. **Tester :**
   - Ouvrez Discord
   - Démarrez FlyNova ACARS
   - Commencez un vol
   - Vérifiez votre profil Discord !

## 🎨 Exemple d'affichage Discord

```
🛫 FlyNova ACARS
───────────────────────
FLY001 | LFPG → KJFK
Cruising - FL350 | 450 kts
⏱️ 2:34:12 elapsed

[🛫 FlyNova Virtual Airlines]
```

## 🔧 Fonctionnalités

### Aircraft Type
- ✅ Détection automatique depuis MSFS
- ✅ Affichage en temps réel
- ✅ Mise à jour dans le dashboard
- ✅ Utilise le nom complet de l'avion

### Discord Rich Presence
- ✅ Activation automatique au démarrage du vol
- ✅ Mise à jour en temps réel (chaque seconde)
- ✅ Affiche la phase de vol
- ✅ Affiche altitude et vitesse
- ✅ Timer de vol
- ✅ Bouton vers votre site VA
- ✅ Déconnexion automatique à la fin du vol

## 📝 Détails Techniques

### Comment ça marche ?

**Aircraft Type :**
1. SimConnect lit la variable TITLE depuis MSFS
2. FlightTracker stocke l'information
3. Dashboard affiche le nom réel de l'avion

**Discord Presence :**
1. Se connecte à Discord via IPC
2. Met à jour toutes les secondes avec :
   - Numéro de vol
   - Route (départ → arrivée)
   - Phase de vol actuelle
   - Données de vol (altitude, vitesse)
3. Calcule le temps écoulé automatiquement

### Phases de vol affichées

| Phase | Affichage Discord |
|-------|------------------|
| Preflight | `Preflight - B777-300ER` |
| Taxi | `Taxiing - 15 kts` |
| Takeoff | `Takeoff - 1250 ft` |
| Climb | `Climbing - FL180 \| 320 kts` |
| Cruise | `Cruising - FL350 \| 450 kts` |
| Descent | `Descending - FL150 \| 280 kts` |
| Approach | `Approaching KJFK - 2500 ft` |
| Landing | `Landing at KJFK` |
| Arrived | `Arrived at KJFK ✅` |

## 🐛 Résolution de problèmes

### Aircraft Type reste "N/A"
**Causes possibles :**
- MSFS n'est pas connecté
- Pas encore dans l'avion
- SimConnect non configuré

**Solution :**
- Vérifiez que MSFS est lancé
- Chargez un vol dans MSFS
- Attendez quelques secondes

### Discord ne s'affiche pas
**Causes possibles :**
- Discord n'est pas ouvert
- Client ID invalide
- Discord-rpc non installé

**Solution :**
```powershell
# Vérifier l'installation
npm list discord-rpc

# Réinstaller si nécessaire
npm install discord-rpc
```

- Ouvrez Discord avant de démarrer le vol
- Vérifiez le Client ID dans discord-presence.js

## 📚 Documentation Complète

Pour plus de détails :
- **Discord Setup :** Voir `DISCORD-SETUP.md`
- **SimConnect :** Voir `SIMCONNECT-TEST.md`
- **Guide Général :** Voir `GUIDE-UTILISATION.md`

## 🎉 Profitez !

Vous êtes maintenant prêt à voler avec :
- ✅ Affichage du vrai nom de l'avion
- ✅ Discord Rich Presence stylée
- ✅ Informations en temps réel

**Bon vol, Capitaine ! ✈️**

---

**Questions ?** Consultez les fichiers de documentation ou les logs dans la console.
