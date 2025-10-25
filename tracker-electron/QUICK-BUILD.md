# 🚀 Quick Build - FlyNova ACARS Tracker

## ⚡ Build Rapide (1 commande)

### Windows
```bash
# Double-cliquez sur :
build-app.bat

# Ou depuis PowerShell :
.\build-app.bat
```

Le script va :
1. ✅ Vérifier Node.js et npm
2. ✅ Installer les dépendances si nécessaire
3. ✅ Vérifier la configuration de l'API
4. ✅ Nettoyer le dossier dist
5. ✅ Créer le build
6. ✅ Afficher le fichier .exe créé

---

## 📦 Résultat

Après le build, vous trouverez dans `dist/` :

```
📁 dist/
  └─ FlyNova ACARS Tracker Setup 2.0.0.exe  ← Votre installateur !
```

**Taille** : ~150-200 MB

---

## 🎯 Étapes de Publication

### 1. Créer le Build
```bash
.\build-app.bat
```

### 2. Tester l'Installateur
```bash
cd dist
.\FlyNova ACARS Tracker Setup 2.0.0.exe
```

### 3. Publier

#### Option A : GitHub Releases (Recommandé)
1. Aller sur : https://github.com/MsNCreatureS/Flynova_acars/releases
2. Cliquer sur "Create a new release"
3. Tag : `v2.0.0`
4. Titre : `FlyNova ACARS Tracker v2.0.0`
5. Upload : `FlyNova ACARS Tracker Setup 2.0.0.exe`
6. Copier les notes de version depuis `CHANGELOG.md`
7. Publier !

#### Option B : Google Drive / Dropbox
1. Upload le fichier .exe
2. Générer un lien de partage
3. Partager le lien

#### Option C : Votre Site Web
1. Upload sur votre serveur
2. Créer une page de téléchargement

---

## 📋 Notes de Version Exemple

```markdown
# FlyNova ACARS Tracker v2.0.0

## ✨ Nouveautés
- 🔔 Système de notifications moderne
- 💬 Modales de confirmation élégantes
- 🌐 Connexion à l'API de production
- 🎨 Interface modernisée

## 📥 Installation
1. Télécharger l'installateur
2. Exécuter et suivre les instructions
3. Lancer depuis le bureau ou menu démarrer

## 📋 Prérequis
- Windows 10/11 (64-bit)
- Connexion Internet
- Compte FlyNova actif

## 🐛 Problèmes Connus
Aucun

## 📞 Support
https://github.com/MsNCreatureS/Flynova_acars
```

---

## ⚠️ Avant de Publier

### Checklist
- [ ] Version mise à jour (2.0.0)
- [ ] API configurée pour production
- [ ] Application testée (`npm start`)
- [ ] Build créé et testé
- [ ] Installateur testé (installation complète)
- [ ] Fonctionnalités validées (login, vol, etc.)

---

## 🎯 Commandes Utiles

### Build Standard
```bash
npm run build
```

### Build Portable (sans installation)
```bash
npm run build:portable
```

### Nettoyer et Rebuild
```bash
Remove-Item -Recurse -Force dist
npm run build
```

---

## 💡 Conseils

### 1. Testez TOUJOURS avant de publier
```bash
# Tester l'app en mode dev
npm start

# Tester le build
.\dist\FlyNova ACARS Tracker Setup 2.0.0.exe
```

### 2. Versioning Sémantique
- `2.0.0` = Nouvelle version majeure
- `2.1.0` = Nouvelles fonctionnalités
- `2.0.1` = Corrections de bugs

### 3. Communication
Informez vos utilisateurs :
- Sur Discord/Forum
- Par email
- Sur les réseaux sociaux

---

## 📊 Après Publication

### Suivre les Téléchargements
GitHub Releases affiche automatiquement :
- Nombre de téléchargements
- Par version
- Par fichier

### Gérer les Retours
- Créer un canal de feedback
- Suivre les issues GitHub
- Répondre aux questions

### Mises à Jour
```bash
# Incrémenter la version
# Modifier package.json : "version": "2.1.0"

# Rebuild
npm run build

# Publier nouvelle release
```

---

**C'est prêt ! Votre application est maintenant distribuable ! 🎉**
