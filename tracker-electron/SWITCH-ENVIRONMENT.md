# 🔄 Guide de Basculement Dev/Production

Ce guide explique comment basculer facilement entre l'environnement de développement et de production.

---

## 🎯 Configuration Actuelle

L'application est configurée pour **PRODUCTION** par défaut :
```
https://flynova-backend-production.up.railway.app/api
```

---

## 🔄 Basculer vers Développement Local

### Méthode 1 : Modification Directe (Simple)

Modifier **`src/services/api.js`** :
```javascript
// Ligne 2
const API_BASE_URL = 'http://localhost:3001/api/acars'; // Dev local
```

Et **`src/pages/dashboard.html`** :
```javascript
// Ligne ~226
vaLogoElement.src = 'http://localhost:3000' + va.logo_url;
```

---

### Méthode 2 : Fichier d'Environnement (Recommandé)

#### 1. Utiliser `env-config.js`

Dans **`src/services/env-config.js`**, changer la ligne 7 :
```javascript
const ENVIRONMENT = 'development'; // ← Changer de 'production' à 'development'
```

#### 2. Modifier `api.js` pour utiliser env-config

Dans **`src/services/api.js`**, ajouter en haut :
```javascript
// Charger la configuration d'environnement
// const ENV_CONFIG = require('./env-config'); // Si Node.js
// const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

// Ou pour le moment, changez manuellement :
const API_BASE_URL = 'http://localhost:3001/api/acars'; // Dev
```

---

## 🌐 Basculer vers Production

Simplement changer l'URL vers :
```javascript
const API_BASE_URL = 'https://flynova-backend-production.up.railway.app/api/acars';
```

---

## 📝 Checklist de Basculement

### Vers Développement Local
- [ ] Modifier `src/services/api.js` → `http://localhost:3001/api/acars`
- [ ] Modifier `src/pages/dashboard.html` → `http://localhost:3000`
- [ ] Modifier `test-api.html` → `http://localhost:3001/api/acars`
- [ ] Démarrer le serveur local : `npm start` (dans le dossier backend)
- [ ] Tester la connexion

### Vers Production
- [ ] Modifier `src/services/api.js` → `https://flynova-backend-production.up.railway.app/api/acars`
- [ ] Modifier `src/pages/dashboard.html` → `https://flynova-backend-production.up.railway.app`
- [ ] Modifier `test-api.html` → `https://flynova-backend-production.up.railway.app/api/acars`
- [ ] Vérifier que Railway est déployé
- [ ] Tester la connexion

---

## 🧪 Tester l'Environnement

### Test API
```bash
# Dev Local
curl http://localhost:3001/api/acars/test

# Production
curl https://flynova-backend-production.up.railway.app/api/acars/test
```

### Test dans l'App
1. Ouvrir `test-api.html`
2. Cliquer sur "Test API"
3. Vérifier la réponse

---

## 💡 Script de Basculement Rapide

Créer un fichier `switch-env.bat` (Windows) :
```batch
@echo off
echo Basculer vers quel environnement ?
echo 1. Developpement Local
echo 2. Production Railway
set /p choice="Choix (1 ou 2): "

if "%choice%"=="1" (
    echo Basculement vers DEV...
    powershell -Command "(gc src\services\api.js) -replace 'https://flynova-backend-production.up.railway.app', 'http://localhost:3001' | Out-File -encoding ASCII src\services\api.js"
    echo ✅ Environnement: DEVELOPPEMENT
) else (
    echo Basculement vers PROD...
    powershell -Command "(gc src\services\api.js) -replace 'http://localhost:3001', 'https://flynova-backend-production.up.railway.app' | Out-File -encoding ASCII src\services\api.js"
    echo ✅ Environnement: PRODUCTION
)
pause
```

Ou `switch-env.sh` (Linux/Mac) :
```bash
#!/bin/bash
echo "Basculer vers quel environnement ?"
echo "1. Développement Local"
echo "2. Production Railway"
read -p "Choix (1 ou 2): " choice

if [ "$choice" == "1" ]; then
    echo "Basculement vers DEV..."
    sed -i 's|https://flynova-backend-production.up.railway.app|http://localhost:3001|g' src/services/api.js
    echo "✅ Environnement: DÉVELOPPEMENT"
else
    echo "Basculement vers PROD..."
    sed -i 's|http://localhost:3001|https://flynova-backend-production.up.railway.app|g' src/services/api.js
    echo "✅ Environnement: PRODUCTION"
fi
```

---

## 🔍 Vérifier l'Environnement Actif

Ouvrir la console du navigateur (F12) dans l'app et taper :
```javascript
console.log('API URL:', API_BASE_URL);
```

Ou regarder les requêtes dans l'onglet Network.

---

## 📊 Tableau Récapitulatif

| Fichier | Dev Local | Production |
|---------|-----------|------------|
| `api.js` | `http://localhost:3001/api/acars` | `https://flynova-backend-production.up.railway.app/api/acars` |
| `dashboard.html` | `http://localhost:3000` | `https://flynova-backend-production.up.railway.app` |
| `test-api.html` | `http://localhost:3001/api/acars` | `https://flynova-backend-production.up.railway.app/api/acars` |
| `config.js` | `http://localhost:3001/api` | `https://flynova-backend-production.up.railway.app/api` |

---

## ⚠️ Important

- Ne **jamais commit** avec l'URL de dev si vous utilisez la production
- Toujours **vérifier** l'environnement avant de tester
- Utiliser un fichier `.env` pour gérer les configurations (à venir)

---

**Actuellement configuré pour : PRODUCTION 🚀**
