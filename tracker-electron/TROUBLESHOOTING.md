# 🔧 Guide de Dépannage - FlyNova ACARS

## Problème actuel : Erreur 400 Bad Request sur /api/auth/login

### Causes possibles et solutions :

## 1. Vérifier que le backend est démarré

```bash
# Dans le dossier du backend FlyNova
cd C:\wamp64\www\FlyNova_V2\backend
node server.js
```

Vous devriez voir :
```
✈️  FlyNova API Server running on port 3001
🌍 Environment: development
```

## 2. Vérifier que le fichier acars.js existe

Le fichier doit être créé ici :
```
C:\wamp64\www\FlyNova_V2\backend\routes\acars.js
```

**Créer le fichier avec le code fourni précédemment.**

## 3. Vérifier le CORS dans server.js

Dans `backend/server.js`, la configuration CORS doit inclure `file://*` :

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'file://*'], // ← Important pour Electron
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 4. Tester l'API depuis le navigateur

Ouvrir le fichier de test :
```
file:///C:/wamp64/www/Flynova_acars/tracker-electron/test-api.html
```

Tester dans l'ordre :
1. Test connexion API
2. Test login (avec vos identifiants)
3. Test vol actif

## 5. Vérifier les logs du backend

Dans le terminal où tourne le backend, vous devriez voir :
- Les requêtes entrantes
- Les erreurs éventuelles

## 6. Erreur 400 - Body vide

L'erreur 400 signifie souvent que le body de la requête est vide ou mal formaté.

**Solution :** Vérifier que `express.json()` est présent dans server.js :

```javascript
app.use(express.json()); // ← Doit être AVANT les routes
app.use(express.urlencoded({ extended: true }));
```

## 7. Créer un utilisateur de test

Si vous n'avez pas encore d'utilisateur dans la BDD :

```sql
-- Générer un hash bcrypt pour 'test123'
-- Utiliser https://bcrypt-generator.com/ avec 10 rounds
-- Exemple de hash : $2b$10$YourHashedPasswordHere

INSERT INTO users (email, username, password_hash, first_name, last_name, status)
VALUES (
  'test@flynova.com',
  'testpilot',
  '$2b$10$Wz5qN.1r7qJxYYH8gF7m0uZLNxN9Mj5b4.wZLvBf8gF7m0uZLNxN9M', -- Remplacer par votre hash
  'Test',
  'Pilot',
  'active'
);
```

## 8. Vérifier la route dans server.js

Dans `backend/server.js`, vérifier que la ligne existe :

```javascript
const acarsRoutes = require('./routes/acars');
// ...
app.use('/api/acars', acarsRoutes);
```

## 9. Test curl depuis le terminal

```bash
# Test endpoint de test
curl http://localhost:3001/api/acars/test

# Test login
curl -X POST http://localhost:3001/api/acars/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testpilot\",\"password\":\"test123\"}"
```

## 10. Vérifier les variables d'environnement

Dans `backend/.env`, vérifier :

```env
JWT_SECRET=lc2tTBy*EQDhpGH2bduc!kkL@#5EXtCCevNaGiH2Xf0W1K9u8T#CcV#JFAasZv2@
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=flynova
DB_PORT=3306
PORT=3001
```

## 11. Vérifier la connexion à la base de données

Dans `backend/config/database.js`, le pool MySQL doit être configuré correctement.

## 12. Redémarrer complètement

1. Arrêter le backend (Ctrl+C)
2. Arrêter le tracker Electron
3. Redémarrer le backend : `node server.js`
4. Redémarrer le tracker : `npm start`

## 13. Vérifier les permissions

Si erreur CORS persiste, ajouter temporairement :

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
```

## 14. Activer les logs détaillés

Dans `backend/routes/acars.js`, ajouter des logs :

```javascript
router.post('/auth/login', async (req, res) => {
  console.log('📥 Login request received');
  console.log('Body:', req.body);
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    console.log('❌ Missing username or password');
    return res.status(400).json({
      success: false,
      message: 'Username et password requis'
    });
  }
  
  // ... reste du code
});
```

## 15. Vérifier que mysql2 est installé

```bash
cd backend
npm install mysql2
```

## Checklist de vérification rapide

- [ ] Backend démarré et affiche le port 3001
- [ ] Fichier `routes/acars.js` créé
- [ ] Route `/api/acars` ajoutée dans server.js
- [ ] CORS inclut `file://*`
- [ ] `express.json()` avant les routes
- [ ] Variables .env configurées
- [ ] Utilisateur de test créé dans la BDD
- [ ] Test API fonctionne : `http://localhost:3001/api/acars/test`
- [ ] Tracker pointe vers `http://localhost:3001/api/acars`

## Contact

Si le problème persiste après toutes ces vérifications, vérifier :
1. Les logs du backend
2. La console développeur du tracker (F12)
3. Les requêtes réseau (onglet Network dans DevTools)

---

**Pour tester rapidement :** Ouvrir `test-api.html` dans un navigateur et tester chaque endpoint.
