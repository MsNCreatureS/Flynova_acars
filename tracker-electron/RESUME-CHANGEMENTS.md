# ✅ Corrections et Améliorations - FlyNova ACARS

## 🎯 Résumé des Changements

### 1. ✈️ Fix: Aircraft Type - Affiche maintenant le vrai avion

**Problème :** Le type d'avion affichait toujours "N/A" dans le dashboard

**Solution :** 
- Lecture du TITLE depuis MSFS via SimConnect
- Affichage en temps réel du nom complet de l'avion
- Mise à jour automatique quand vous changez d'avion

**Exemple d'affichage :**
- Au lieu de : `N/A`
- Maintenant : `Airbus A320neo FlyByWire` ou `Boeing 747-8 Intercontinental`

---

### 2. 🎮 Nouveau: Discord Rich Presence

**Fonctionnalité :** Affiche votre vol en cours sur votre profil Discord

**Ce qui s'affiche :**
```
🛫 FlyNova ACARS
───────────────────────
FLY001 | LFPG → KJFK
Cruising - FL350 | 450 kts
⏱️ Elapsed: 2:34:12

[🛫 FlyNova Virtual Airlines]
```

**Informations affichées :**
- ✈️ Numéro de vol (ex: FLY001)
- 🌍 Route complète (ex: LFPG → KJFK)
- 📊 Phase de vol en temps réel
- 🎚️ Altitude et vitesse
- ⏱️ Temps de vol écoulé
- 🏢 Nom de votre compagnie virtuelle
- 🔗 Bouton cliquable vers votre site VA

**Phases affichées sur Discord :**
- **Preflight** → `Preflight - B777-300ER`
- **Taxi** → `Taxiing - 15 kts`
- **Takeoff** → `Takeoff - 1250 ft`
- **Climb** → `Climbing - FL180 | 320 kts`
- **Cruise** → `Cruising - FL350 | 450 kts`
- **Descent** → `Descending - FL150 | 280 kts`
- **Approach** → `Approaching KJFK - 2500 ft`
- **Landing** → `Landing at KJFK`
- **Arrived** → `Arrived at KJFK ✅`

---

## 📦 Fichiers Modifiés

### Fichiers Existants Modifiés

1. **`package.json`**
   - Ajout de `discord-rpc` dans les dépendances

2. **`src/services/simconnect.js`**
   - Ajout de la lecture du TITLE (nom de l'avion)
   - Nouvelle définition de données pour STRING256
   - Requête ONCE pour récupérer le nom

3. **`src/services/flight-tracker.js`**
   - Ajout du champ `aircraftType` dans currentState
   - Import et initialisation de Discord Presence
   - Mise à jour Discord à chaque seconde
   - Déconnexion automatique Discord en fin de vol

4. **`src/pages/dashboard.html`**
   - Mise à jour dynamique de l'aircraft type depuis le simulateur

### Nouveaux Fichiers Créés

1. **`src/services/discord-presence.js`**
   - Service complet de gestion Discord Rich Presence
   - Connexion/Déconnexion automatique
   - Mise à jour en temps réel
   - Gestion des icônes par phase

2. **`DISCORD-SETUP.md`**
   - Guide complet de configuration Discord
   - Instructions pas à pas
   - Dépannage
   - Checklist

3. **`MISE-A-JOUR.md`**
   - Guide rapide des changements
   - Installation rapide
   - Exemples d'utilisation

4. **`config-discord.example.js`**
   - Fichier d'exemple de configuration
   - Commentaires détaillés
   - Checklist intégrée

---

## 🚀 Installation et Configuration

### Étape 1: Installer les dépendances

```powershell
npm install
```

Cette commande installe `discord-rpc` automatiquement.

### Étape 2: Configurer Discord (Optionnel mais recommandé)

#### A. Créer une Application Discord (2 minutes)

1. Allez sur https://discord.com/developers/applications
2. Cliquez sur **"New Application"**
3. Nommez-la "FlyNova ACARS"
4. Cliquez sur **"Create"**

#### B. Récupérer le Client ID (1 minute)

1. Dans **"General Information"**
2. Copiez **"Application ID"**
3. Ouvrez `src/services/discord-presence.js`
4. Ligne 9, remplacez :
   ```javascript
   this.clientId = 'VOTRE_CLIENT_ID_ICI';
   ```

#### C. Ajouter le Logo (Optionnel - 2 minutes)

1. Dans Discord Developer Portal → **"Rich Presence"** → **"Art Assets"**
2. Cliquez **"Add Image"**
3. Uploadez votre logo (512x512 px minimum)
4. Nommez-le exactement : `flynova_logo`

#### D. Ajouter les Icônes de Phase (Optionnel - 5 minutes)

Uploadez une icône pour chaque phase avec ces noms EXACTS :
- `preflight`
- `taxi`
- `takeoff`
- `climb`
- `cruise`
- `descent`
- `approach`
- `landing`
- `arrived`
- `airplane` (icône par défaut)

**Dimensions :** 512x512 px ou 1024x1024 px (PNG avec fond transparent)

### Étape 3: Tester

1. **Ouvrez Discord** (important !)
2. Lancez FlyNova ACARS
3. Connectez-vous
4. Démarrez un vol
5. Vérifiez votre profil Discord

---

## 🎨 Personnalisation

### Changer l'URL du Bouton

Dans `src/services/discord-presence.js`, ligne ~144 :

```javascript
const buttons = [
  {
    label: `🛫 ${vaName}`,
    url: 'https://votre-site-va.com' // ← Changez ici
  }
];
```

### Changer le Texte du Logo

Dans `src/services/discord-presence.js`, ligne ~133 :

```javascript
let largeImageText = `FlyNova ACARS`; // ← Changez ici
```

### Changer les Noms d'Images

Si vos images ont des noms différents, modifiez dans `getPhaseIcon()` :

```javascript
getPhaseIcon(phase) {
  const phaseIcons = {
    'Preflight': 'mon_preflight', // ← Vos noms
    'Taxi': 'mon_taxi',
    // ... etc
  };
  return phaseIcons[phase] || 'airplane';
}
```

---

## 🔍 Vérification

### Aircraft Type fonctionne ?

✅ **Test :**
1. Lancez MSFS
2. Chargez un vol
3. Démarrez FlyNova ACARS
4. Commencez le vol
5. Regardez le dashboard → "Aircraft Type" doit afficher le nom de votre avion

❌ **Si ça ne marche pas :**
- Vérifiez que MSFS est bien lancé
- Assurez-vous d'être dans l'avion (pas dans le menu)
- Regardez la console pour les messages d'erreur

### Discord Presence fonctionne ?

✅ **Test :**
1. Ouvrez Discord
2. Démarrez un vol dans FlyNova ACARS
3. Allez sur votre profil Discord
4. Vous devriez voir "Playing FlyNova ACARS"

❌ **Si ça ne marche pas :**
- Vérifiez que Discord est ouvert
- Vérifiez le Client ID dans `discord-presence.js`
- Regardez la console :
  - `✅ Discord Rich Presence connected` = OK
  - `❌ Discord connection failed` = Problème de config

---

## 📊 Logs de Debug

### Console Logs à vérifier

**Aircraft Type :**
```
✅ SimConnect data definitions configured
✈️ Aircraft detected: Airbus A320neo FlyByWire
```

**Discord :**
```
✅ Discord Rich Presence enabled
✅ Discord Rich Presence connected
✅ Discord presence updated: Cruise
```

---

## 🐛 Dépannage Rapide

### "Aircraft Type" reste à "N/A"

**Solutions :**
1. Vérifiez que MSFS est lancé
2. Chargez un vol dans MSFS
3. Attendez quelques secondes après le démarrage du tracker
4. Vérifiez la console pour des erreurs SimConnect

### Discord ne s'affiche pas

**Solutions :**
1. Vérifiez que Discord est ouvert
2. Vérifiez le Client ID (doit être un nombre à 18-19 chiffres)
3. Réinstallez discord-rpc : `npm install discord-rpc`
4. Redémarrez Discord et FlyNova ACARS

### Images Discord ne s'affichent pas

**Solutions :**
1. Vérifiez les noms dans Discord Developer Portal
2. Les noms sont sensibles à la casse : `flynova_logo` ≠ `FlyNova_Logo`
3. Attendez 5-10 minutes après l'upload
4. Videz le cache Discord (Ctrl+R)

---

## 📚 Documentation Complète

- **`DISCORD-SETUP.md`** - Guide complet Discord Rich Presence
- **`MISE-A-JOUR.md`** - Résumé des changements
- **`SIMCONNECT-TEST.md`** - Tests SimConnect
- **`GUIDE-UTILISATION.md`** - Guide général d'utilisation

---

## ✨ Fonctionnalités en Action

### Avant
```
Aircraft Type: N/A
Pas de Discord Presence
```

### Après
```
Aircraft Type: Boeing 747-8 Intercontinental
Discord: FLY001 | LFPG → KJFK
         Cruising - FL350 | 450 kts
         ⏱️ 2:34:12
```

---

## 🎉 Prêt à Voler !

Tout est configuré ! Vous avez maintenant :

✅ Affichage du vrai nom de l'avion  
✅ Discord Rich Presence avec infos en temps réel  
✅ Mise à jour automatique toutes les secondes  
✅ Déconnexion propre en fin de vol  
✅ Support de toutes les phases de vol  

**Bon vol, Capitaine ! ✈️**

---

**Besoin d'aide ?** Consultez les fichiers de documentation ou vérifiez les logs dans la console.
