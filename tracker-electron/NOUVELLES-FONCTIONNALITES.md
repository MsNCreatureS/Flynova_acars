# 🎉 FlyNova ACARS - Nouvelles Fonctionnalités

## ✅ Corrections et Améliorations

### 1. ✈️ Aircraft Type - CORRIGÉ
**Avant:** Affichait "N/A"  
**Maintenant:** Affiche le vrai nom de l'avion (ex: "Boeing 747-8 Intercontinental")

### 2. 🎮 Discord Rich Presence - NOUVEAU
Montrez à vos amis que vous êtes en vol avec toutes les infos en temps réel !

---

## 🚀 Installation Rapide

```powershell
# 1. Installer les dépendances
npm install

# 2. C'est tout ! L'aircraft type fonctionne maintenant
```

---

## 🎮 Activer Discord (Optionnel)

### Étape 1: Créer une app Discord (2 min)
1. https://discord.com/developers/applications
2. "New Application" → "FlyNova ACARS"
3. Copier le "Application ID"

### Étape 2: Configurer (1 min)
Dans `src/services/discord-presence.js`, ligne 9:
```javascript
this.clientId = 'VOTRE_CLIENT_ID_ICI';
```

### Étape 3: Tester
1. Ouvrir Discord
2. Démarrer un vol
3. Regarder votre profil Discord !

---

## 📚 Documentation

- **`RESUME-CHANGEMENTS.md`** - Guide complet des changements
- **`DISCORD-SETUP.md`** - Configuration Discord détaillée
- **`DISCORD-EXEMPLES.md`** - Exemples visuels
- **`MISE-A-JOUR.md`** - Guide de mise à jour rapide

---

## 🎯 Ce qui a changé

### Fichiers Modifiés
- ✅ `package.json` - Ajout discord-rpc
- ✅ `src/services/simconnect.js` - Lecture TITLE
- ✅ `src/services/flight-tracker.js` - Support Discord
- ✅ `src/pages/dashboard.html` - Mise à jour aircraft type

### Nouveaux Fichiers
- ✅ `src/services/discord-presence.js` - Service Discord
- ✅ `DISCORD-SETUP.md` - Guide Discord
- ✅ `DISCORD-EXEMPLES.md` - Exemples visuels
- ✅ `RESUME-CHANGEMENTS.md` - Guide complet
- ✅ `MISE-A-JOUR.md` - Guide rapide
- ✅ `config-discord.example.js` - Configuration exemple

---

## ✨ Aperçu Discord

```
🛫 FlyNova ACARS
───────────────────────
FLY001 | LFPG → KJFK
Cruising - FL350 | 450 kts
⏱️ Elapsed: 2:34:12

[🛫 FlyNova Virtual Airlines]
```

---

## 🐛 Problèmes ?

**Aircraft Type reste "N/A" ?**
- MSFS doit être lancé
- Vous devez être dans l'avion
- Attendez quelques secondes

**Discord ne s'affiche pas ?**
- Discord doit être ouvert
- Vérifiez le Client ID
- Consultez `DISCORD-SETUP.md`

---

**Bon vol ! ✈️**
