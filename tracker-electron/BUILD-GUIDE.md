# 📦 Guide de Build - FlyNova ACARS Tracker

Ce guide explique comment créer un fichier exécutable (.exe) de l'application.

---

## 🚀 Création Rapide

### Méthode Simple (Recommandée)
```bash
npm run build
```

Le fichier .exe sera créé dans le dossier `dist/`

---

## 📋 Prérequis

### 1. Node.js et npm installés
Vérifier :
```bash
node --version
npm --version
```

### 2. Dépendances installées
```bash
npm install
```

---

## 🛠️ Commandes de Build

### Build Standard (64-bit Windows)
```bash
npm run build
```
Crée : `FlyNova ACARS Tracker Setup 2.0.0.exe`

### Build Version Portable
```bash
npm run build:portable
```
Crée : `FlyNova ACARS Tracker 2.0.0.exe` (portable, sans installation)

### Build 32-bit et 64-bit
```bash
npm run build:all
```
Crée les deux versions

---

## 📂 Structure de Sortie

Après le build, dans le dossier `dist/` :

```
dist/
├── FlyNova ACARS Tracker Setup 2.0.0.exe    (Installateur)
├── win-unpacked/                             (Version non empaquetée)
│   └── FlyNova ACARS Tracker.exe
└── latest.yml                                (Métadonnées)
```

---

## ⚙️ Configuration du Build

La configuration se trouve dans `package.json` :

### Version
```json
"version": "2.0.0"
```

### Informations de l'application
```json
"productName": "FlyNova ACARS Tracker",
"appId": "com.flynova.acars"
```

### Fichiers inclus
```json
"files": [
  "main.js",
  "src/**/*",
  "logos/**/*",
  "assets/**/*",
  "config.js",
  "package.json"
]
```

---

## 🎨 Icône de l'Application

### Créer l'icône (icon.ico)

1. **Préparer une image PNG** (512x512px minimum)
2. **Convertir en .ico** :
   - En ligne : https://convertio.co/png-ico/
   - Ou utiliser un logiciel : GIMP, Photoshop, etc.

3. **Placer dans** `build/icon.ico`

### Format requis
- **Type** : .ico
- **Tailles** : 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
- **Nom** : `icon.ico`
- **Emplacement** : `build/icon.ico`

---

## 📦 Types de Distribution

### NSIS Installer (Défaut)
- Installateur Windows classique
- Permet de choisir le dossier d'installation
- Crée un raccourci sur le bureau
- Crée un raccourci dans le menu Démarrer
- Gère la désinstallation proprement

### Portable
- Fichier .exe unique
- Pas d'installation requise
- Peut être lancé depuis une clé USB
- Idéal pour les tests

---

## 🔧 Personnalisation Avancée

### Modifier l'installateur NSIS

Dans `package.json`, section `"nsis"` :

```json
"nsis": {
  "oneClick": false,                           // Installateur avec choix
  "allowToChangeInstallationDirectory": true,  // Choix du dossier
  "createDesktopShortcut": true,               // Raccourci bureau
  "createStartMenuShortcut": true,             // Menu démarrer
  "shortcutName": "FlyNova ACARS",            // Nom du raccourci
  "installerIcon": "build/icon.ico",          // Icône installateur
  "uninstallerIcon": "build/icon.ico",        // Icône désinstallateur
  "license": "LICENSE.txt",                    // Fichier de licence
  "language": "1033"                           // Anglais (1036 = Français)
}
```

### Changer la langue de l'installateur
```json
"language": "1036"  // Français
```

---

## 🚀 Étapes de Publication

### 1. Préparer la Release

#### a. Mettre à jour la version
Dans `package.json` :
```json
"version": "2.0.0"  // Incrémenter
```

#### b. Vérifier la configuration production
Dans `src/services/api.js` :
```javascript
const API_BASE_URL = 'https://flynova-backend-production.up.railway.app/api/acars';
```

#### c. Tester l'application
```bash
npm start
```

### 2. Créer le Build

```bash
# Nettoyer le dossier dist précédent
Remove-Item -Recurse -Force dist

# Créer le build
npm run build
```

### 3. Tester l'Installateur

1. Aller dans `dist/`
2. Lancer `FlyNova ACARS Tracker Setup 2.0.0.exe`
3. Installer l'application
4. Tester toutes les fonctionnalités
5. Désinstaller et réinstaller pour vérifier

### 4. Publier

#### Option A : GitHub Releases
1. Créer un tag de version :
```bash
git tag v2.0.0
git push origin v2.0.0
```

2. Aller sur GitHub → Releases → Create Release
3. Upload `FlyNova ACARS Tracker Setup 2.0.0.exe`
4. Ajouter les notes de version (CHANGELOG)

#### Option B : Site Web
- Upload sur votre serveur
- Créer une page de téléchargement

#### Option C : Partage Direct
- Partager le fichier .exe directement
- Via Google Drive, Dropbox, etc.

---

## 📊 Taille des Fichiers

### Estimations
- **Installateur** : ~150-200 MB
- **Application installée** : ~200-250 MB

### Réduire la taille
Exclure les fichiers de dev dans `package.json` :
```json
"files": [
  "!node_modules",
  "!test-*.html",
  "!*.md",
  "!build"
]
```

---

## 🐛 Troubleshooting

### Erreur "electron-builder not found"
```bash
npm install --save-dev electron-builder
```

### Erreur "icon.ico not found"
Créer le fichier `build/icon.ico` (voir section Icône)

### Build très lent
- Normal pour le premier build (~5-10 min)
- Les builds suivants sont plus rapides (~2-3 min)

### Erreur de permission
Lancer PowerShell en **Administrateur**

### Antivirus bloque le build
- Ajouter le dossier à l'exclusion temporairement
- Ou désactiver l'antivirus pendant le build

---

## ✅ Checklist Avant Publication

- [ ] Version mise à jour dans `package.json`
- [ ] API configurée pour production
- [ ] Icône `build/icon.ico` présente
- [ ] Licence `LICENSE.txt` présente
- [ ] Application testée en local (`npm start`)
- [ ] Build créé (`npm run build`)
- [ ] Installateur testé (installation complète)
- [ ] Toutes les fonctionnalités testées
- [ ] CHANGELOG.md mis à jour
- [ ] README.md à jour

---

## 📝 Notes de Version

Pour créer de bonnes notes de version :

```markdown
# FlyNova ACARS Tracker v2.0.0

## ✨ Nouveautés
- 🔔 Système de notifications moderne
- 💬 Modales de confirmation interactives
- 🌐 Configuration production Railway

## 🔄 Améliorations
- Meilleure gestion des erreurs
- Messages plus clairs
- Design modernisé

## 🐛 Corrections
- Correction des alertes natives
- Amélioration de la stabilité

## 📥 Installation
1. Télécharger `FlyNova ACARS Tracker Setup 2.0.0.exe`
2. Exécuter l'installateur
3. Suivre les instructions
4. Lancer l'application depuis le bureau ou le menu Démarrer

## 📋 Prérequis
- Windows 10/11 (64-bit)
- Connexion Internet
- MSFS 2020, X-Plane 11/12, ou Prepar3D (optionnel pour tests)
```

---

## 🎯 Commandes Utiles

```bash
# Build standard
npm run build

# Build portable
npm run build:portable

# Nettoyer et rebuild
Remove-Item -Recurse -Force dist; npm run build

# Tester après installation
cd "C:\Users\[USER]\AppData\Local\Programs\flynova-acars-tracker"
.\FlyNova ACARS Tracker.exe
```

---

## 🌐 Distribution

### Téléchargement Recommandé
- GitHub Releases (gratuit, illimité)
- Versioning automatique
- Notes de version intégrées

### Auto-Update (Optionnel)
Configurer dans `package.json` pour les mises à jour automatiques :
```json
"publish": {
  "provider": "github",
  "owner": "MsNCreatureS",
  "repo": "Flynova_acars"
}
```

---

**Bon build ! 🚀**

*Dernière mise à jour : 25 octobre 2025*
