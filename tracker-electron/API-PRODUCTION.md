# 🌐 Configuration de l'API - Production

## ✅ URLs Mises à Jour

L'application FlyNova ACARS Tracker pointe maintenant vers le serveur de **production** :

### 🚀 API Backend Production
```
https://flynova-backend-production.up.railway.app/api
```

---

## 📝 Fichiers Modifiés

### 1. **src/services/api.js**
```javascript
const API_BASE_URL = 'https://flynova-backend-production.up.railway.app/api/acars';
```
- ✅ Toutes les requêtes API (login, flights, reports, etc.)
- ✅ Authentication et tokens
- ✅ Télémétrie

### 2. **src/pages/dashboard.html**
```javascript
vaLogoElement.src = 'https://flynova-backend-production.up.railway.app' + va.logo_url;
```
- ✅ Chargement des logos VA

### 3. **test-api.html**
```javascript
const API_BASE_URL = 'https://flynova-backend-production.up.railway.app/api/acars';
```
- ✅ Tests de l'API en production

### 4. **config.js**
```javascript
API_BASE_URL: process.env.API_URL || 'https://flynova-backend-production.up.railway.app/api'
```
- ✅ Configuration globale

---

## 🔄 Basculer entre Dev et Production

### Pour revenir en développement local :

#### Option 1 : Modifier manuellement
Changer l'URL dans `src/services/api.js` :
```javascript
const API_BASE_URL = 'http://localhost:3001/api/acars';
```

#### Option 2 : Variable d'environnement
Créer un fichier `.env` :
```env
API_URL=http://localhost:3001/api
```

#### Option 3 : Fichier de configuration
Modifier `config.js` :
```javascript
API_BASE_URL: 'http://localhost:3001/api'
```

---

## 🧪 Tester la Configuration

### 1. Tester l'API
Ouvrir dans le navigateur :
```
https://flynova-backend-production.up.railway.app/api/acars/test
```

Ou utiliser `test-api.html` :
```bash
# Ouvrir le fichier dans le navigateur
test-api.html
```

### 2. Tester le Login
Dans l'application :
1. Lancer : `npm start`
2. Se connecter avec vos identifiants
3. Vérifier que le dashboard s'affiche correctement

### 3. Vérifier les Logos
- Les logos VA doivent se charger depuis Railway
- Vérifier dans la console (F12) qu'il n'y a pas d'erreurs CORS

---

## 🔐 Sécurité CORS

Assurez-vous que votre backend Railway autorise les requêtes depuis Electron :

```javascript
// Dans votre backend sur Railway
app.use(cors({
  origin: '*', // Ou spécifier les domaines autorisés
  credentials: true
}));
```

---

## 📊 Endpoints Disponibles

Tous les endpoints sont maintenant accessibles via :
```
https://flynova-backend-production.up.railway.app/api/acars/
```

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/test` | GET | Test de connexion |
| `/auth/login` | POST | Authentification |
| `/flights/active/:userId` | GET | Récupérer le vol actif |
| `/flights/:flightId/status` | PATCH | Mettre à jour le statut |
| `/flights/:flightId` | DELETE | Annuler le vol |
| `/flight-reports` | POST | Soumettre le rapport |
| `/flights/:flightId/telemetry` | POST | Envoyer la télémétrie |

---

## 🐛 Troubleshooting

### Erreur CORS
➜ **Problème** : `Access-Control-Allow-Origin` error  
➜ **Solution** : Vérifier la configuration CORS sur Railway

### 401 Unauthorized
➜ **Problème** : Token invalide ou expiré  
➜ **Solution** : Se reconnecter (logout puis login)

### 404 Not Found
➜ **Problème** : Endpoint incorrect  
➜ **Solution** : Vérifier que l'API Railway est bien déployée

### Timeout
➜ **Problème** : Le serveur Railway est en veille (cold start)  
➜ **Solution** : Attendre quelques secondes et réessayer

---

## 📝 Notes Importantes

### ⚠️ HTTPS Requis
Railway utilise HTTPS, assurez-vous que :
- Tous les appels utilisent `https://`
- Pas de mixed content (HTTP + HTTPS)

### 🔄 Redéploiement
Après un redéploiement sur Railway :
- Pas besoin de changer l'URL
- L'application continuera de fonctionner automatiquement

### 💾 Cache
Si les changements ne sont pas visibles :
```bash
# Vider le cache de l'application Electron
# Supprimer : %APPDATA%/tracker-electron/
```

---

## ✅ Checklist de Vérification

- [x] URL API mise à jour dans `api.js`
- [x] URL logos mise à jour dans `dashboard.html`
- [x] URL test mise à jour dans `test-api.html`
- [x] Config globale mise à jour dans `config.js`
- [ ] Tester la connexion
- [ ] Tester le login
- [ ] Tester le chargement d'une réservation
- [ ] Tester le démarrage d'un vol
- [ ] Tester la fin d'un vol
- [ ] Vérifier les logos VA

---

## 🎯 Prochaines Étapes

1. **Tester l'application** avec `npm start`
2. **Vérifier tous les endpoints** avec `test-api.html`
3. **Effectuer un vol complet** de bout en bout
4. **Vérifier les rapports** dans la base de données

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier la console du navigateur (F12)
2. Vérifier les logs Railway
3. Tester les endpoints manuellement
4. Vérifier la configuration CORS

---

**L'application est maintenant configurée pour la production ! 🚀**

*Dernière mise à jour : 25 octobre 2025*
