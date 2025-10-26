# 🎮 Configuration Discord Rich Presence - FlyNova ACARS

## 📋 Vue d'ensemble

Le système Discord Rich Presence permet d'afficher votre vol en cours directement sur votre profil Discord avec des informations en temps réel comme :
- ✈️ Numéro de vol et route
- 🏢 Compagnie virtuelle
- 📊 Phase de vol actuelle
- 🌍 Altitude et vitesse
- ⏱️ Temps de vol écoulé

## 🚀 Installation

### 1. Installer le package Discord RPC

Le package est déjà ajouté dans `package.json`. Installez-le :

```bash
npm install discord-rpc
```

### 2. Créer une Application Discord

1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Cliquez sur **"New Application"**
3. Donnez un nom (ex: "FlyNova ACARS")
4. Cliquez sur **"Create"**

### 3. Configurer l'Application

#### A. Récupérer le Client ID
1. Dans votre application, allez dans **"General Information"**
2. Copiez le **"Application ID"** (Client ID)
3. Ouvrez `src/services/discord-presence.js`
4. Remplacez la ligne :
   ```javascript
   this.clientId = '1234567890123456789'; // Remplacez par votre Client ID
   ```

#### B. Ajouter des Images (Rich Presence Assets)

1. Dans votre application Discord, allez dans **"Rich Presence" → "Art Assets"**
2. Téléchargez les images suivantes :

**Image principale (Large Image) :**
- Nom : `flynova_logo`
- Fichier : Logo de FlyNova (512x512 px minimum)

**Icônes de phase (Small Images) :**
- `preflight` - Icône de préparation
- `taxi` - Icône de taxi
- `takeoff` - Icône de décollage
- `climb` - Icône de montée
- `cruise` - Icône de croisière
- `descent` - Icône de descente
- `approach` - Icône d'approche
- `landing` - Icône d'atterrissage
- `arrived` - Icône d'arrivée
- `airplane` - Icône générique d'avion

**Dimensions recommandées :** 512x512 px ou 1024x1024 px

### 4. Personnaliser l'URL du Bouton

Dans `src/services/discord-presence.js`, modifiez l'URL du bouton :

```javascript
const buttons = [
  {
    label: `🛫 ${vaName}`,
    url: 'https://votre-site-va.com' // Remplacez par l'URL de votre VA
  }
];
```

## 🎨 Exemples d'Images

### Logo Principal
Vous pouvez utiliser le logo FlyNova existant dans `logos/logo_flynova.png`

### Icônes de Phase
Créez ou téléchargez des icônes représentant chaque phase :
- Utilisez des icônes d'avion dans différentes positions
- Couleurs : Bleu (#1E88E5) pour cohérence avec FlyNova
- Format : PNG avec fond transparent

## 📱 Affichage Discord

### Ce qui sera affiché

**Pendant le vol :**
```
🛫 FlyNova ACARS
FLY001 | LFPG → KJFK
Cruising - FL350 | 450 kts
⏱️ Elapsed: 2:34:12
[Bouton: 🛫 FlyNova Virtual Airlines]
```

**Phases détaillées :**
- **Preflight** : `Preflight - B777-300ER`
- **Taxi** : `Taxiing - 15 kts`
- **Takeoff** : `Takeoff - 1250 ft`
- **Climb** : `Climbing - FL180 | 320 kts`
- **Cruise** : `Cruising - FL350 | 450 kts`
- **Descent** : `Descending - FL150 | 280 kts`
- **Approach** : `Approaching KJFK - 2500 ft`
- **Landing** : `Landing at KJFK`
- **Arrived** : `Arrived at KJFK ✅`

## 🔧 Activation

Le Discord Rich Presence s'active **automatiquement** quand vous démarrez un vol :

1. Assurez-vous que Discord est ouvert
2. Démarrez un vol dans FlyNova ACARS
3. Le tracker détectera Discord et mettra à jour votre présence

## 🐛 Dépannage

### ❌ "Discord not available"
**Cause :** Discord n'est pas ouvert ou le Client ID est invalide

**Solution :**
1. Ouvrez Discord
2. Vérifiez que le Client ID dans `discord-presence.js` est correct
3. Redémarrez FlyNova ACARS

### ❌ Images ne s'affichent pas
**Cause :** Les noms d'images ne correspondent pas

**Solution :**
1. Vérifiez les noms dans le Discord Developer Portal
2. Vérifiez qu'ils correspondent exactement dans le code (sensible à la casse)
3. Les images peuvent prendre 5-10 minutes pour être activées

### ❌ Le bouton ne fonctionne pas
**Cause :** URL invalide ou boutons non activés

**Solution :**
1. Vérifiez que l'URL commence par `http://` ou `https://`
2. Dans Discord Developer Portal, vérifiez que les boutons sont activés

### ⚠️ Discord ne se met pas à jour
**Cause :** Cache Discord

**Solution :**
1. Fermez Discord complètement
2. Redémarrez Discord
3. Redémarrez FlyNova ACARS

## 📝 Notes

- Le temps de vol (timestamp) commence quand vous démarrez le vol
- La présence se met à jour toutes les secondes
- La présence est automatiquement effacée quand vous terminez le vol
- Discord doit être ouvert pour que la Rich Presence fonctionne
- Les images peuvent prendre quelques minutes pour être visibles après upload

## 🔄 Désactiver Discord Rich Presence

Si vous ne voulez pas utiliser Discord :

1. Ouvrez `src/services/flight-tracker.js`
2. Commentez ces lignes :

```javascript
// Import Discord Presence (only if available)
/*
let discordPresence = null;
try {
  discordPresence = require('./discord-presence.js');
} catch (error) {
  console.log('⚠️ Discord presence not available');
}
*/
```

Ou simplement ne pas installer le package `discord-rpc`.

## 🎯 Ressources

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord Rich Presence Documentation](https://discord.com/developers/docs/rich-presence/how-to)
- [discord-rpc NPM Package](https://www.npmjs.com/package/discord-rpc)

## ✅ Checklist de Configuration

- [ ] Créer une application Discord
- [ ] Copier le Client ID
- [ ] Mettre à jour le Client ID dans `discord-presence.js`
- [ ] Télécharger le logo principal
- [ ] Télécharger les icônes de phase
- [ ] Mettre à jour l'URL du bouton
- [ ] Installer `npm install`
- [ ] Tester avec Discord ouvert
- [ ] Vérifier l'affichage sur votre profil

---

**Bon vol ! ✈️**
