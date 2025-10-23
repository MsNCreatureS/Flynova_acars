# FlyNova ACARS Tracker

Tracker de vol pour MSFS, X-Plane et Prepar3D développé avec Electron.js pour le système FlyNova.

## 🎯 Fonctionnalités

- ✈️ **Support Multi-Simulateurs** : MSFS 2020, X-Plane 11/12, Prepar3D v4/v5
- 🔐 **Authentification** : Connexion sécurisée avec le système FlyNova
- 📊 **Tracking en temps réel** : Suivi GPS, altitude, vitesse, carburant
- 🎨 **Branding VA** : Interface personnalisée aux couleurs de votre compagnie
- 📈 **Progression visuelle** : Barre de progression du vol en temps réel
- 📝 **Rapports automatiques** : Génération et envoi automatique des rapports ACARS
- 🏆 **Système de points** : Attribution automatique de points selon les performances

## 📋 Prérequis

- Node.js 18+ 
- Windows 10/11 (pour MSFS/P3D)
- Connexion à votre serveur FlyNova backend

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   cd Flynova_acars/tracker-electron
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'API**
   - Ouvrir `src/services/api.js`
   - Modifier `API_BASE_URL` avec l'URL de votre serveur backend
   ```javascript
   const API_BASE_URL = 'http://localhost:3001/api'; // Votre URL
   ```

4. **Lancer l'application**
   ```bash
   npm start
   ```

## 🔧 Configuration Backend

### Endpoints requis

Le tracker nécessite les endpoints suivants sur votre serveur FlyNova :

```
POST   /api/auth/login                    - Authentification
GET    /api/flights/active/:userId        - Récupérer la réservation active
PATCH  /api/flights/:flightId/status      - Mettre à jour le statut du vol
DELETE /api/flights/:flightId             - Annuler le vol
POST   /api/flight-reports                - Soumettre le rapport de vol
POST   /api/flights/:flightId/telemetry   - Envoyer la télémétrie (optionnel)
```

### Intégration au backend existant

1. Copier le contenu de `api-endpoints-example.js`
2. L'intégrer dans votre serveur Express existant
3. Adapter selon votre structure de code

Exemple d'intégration dans `server.js` :
```javascript
const acarsRoutes = require('./routes/acars');
app.use('/api', acarsRoutes);
```

## 📱 Utilisation

### 1. Connexion
- Lancer l'application
- Se connecter avec vos identifiants FlyNova
- Le tracker récupère automatiquement votre réservation active

### 2. Préparation du vol
- L'interface affiche votre vol réservé
- Les couleurs de la VA sont appliquées automatiquement
- Vérifier les informations du vol (route, appareil, etc.)

### 3. Tracking du vol
- Cliquer sur "🛫 Démarrer le vol"
- Le tracker se connecte automatiquement au simulateur actif
- La progression s'affiche en temps réel
- Les phases de vol sont détectées automatiquement :
  - Preflight
  - Taxi
  - Takeoff
  - Climb
  - Cruise
  - Descent
  - Approach
  - Landing
  - Taxi to Gate

### 4. Fin du vol
- Cliquer sur "🛬 Terminer le vol"
- Le rapport est généré et envoyé automatiquement
- Les points sont calculés et attribués
- Les statistiques VA/pilote sont mises à jour

### 5. Annulation
- Cliquer sur "❌ Annuler" pour annuler le vol
- La réservation est supprimée de la base de données

## 🎮 Support des Simulateurs

### Microsoft Flight Simulator 2020
- Connexion via SimConnect
- Tracking complet de tous les paramètres
- ⚠️ Nécessite l'installation de SimConnect SDK

### X-Plane 11/12
- Connexion via UDP DataRefs
- Tracking des positions et paramètres de vol
- Port par défaut : 49000

### Prepar3D v4/v5
- Connexion via SimConnect
- Compatible avec toutes les versions v4+
- ⚠️ Nécessite l'installation de SimConnect SDK

### Mode Simulation
- Mode de test sans simulateur
- Simule un vol complet automatiquement
- Utile pour le développement et les tests

## 📊 Données Collectées

Le tracker collecte et envoie les données suivantes :

- ✅ Position GPS (latitude/longitude)
- ✅ Altitude
- ✅ Vitesse sol
- ✅ Vitesse verticale
- ✅ Cap
- ✅ Carburant consommé
- ✅ Taux d'atterrissage (fpm)
- ✅ Distance parcourue
- ✅ Durée du vol
- ✅ Phases de vol

## 🎨 Personnalisation

### Couleurs de la VA
Les couleurs sont automatiquement appliquées depuis la base de données :
- `primary_color` : Couleur principale
- `secondary_color` : Couleur secondaire
- `accent_color` : Couleur d'accentuation
- `text_on_primary` : Couleur du texte

### Logo de la VA
Le logo est chargé depuis `logo_url` de la table `virtual_airlines`

## 🏗️ Structure du Projet

```
tracker-electron/
├── main.js                          # Point d'entrée Electron
├── package.json                     # Configuration npm
├── api-endpoints-example.js         # Exemples d'endpoints API
├── src/
│   ├── pages/
│   │   ├── login.html              # Page de connexion
│   │   └── dashboard.html          # Dashboard principal
│   ├── services/
│   │   ├── api.js                  # Service API
│   │   └── flight-tracker.js       # Service de tracking
│   └── styles/
│       └── main.css                # Styles CSS
└── logos/
    └── logo_flynova.png            # Logo FlyNova
```

## 🔐 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Authentification JWT avec expiration
- Validation des tokens à chaque requête
- Les utilisateurs ne peuvent accéder qu'à leurs propres données

## 📦 Build

Pour créer un exécutable distributable :

```bash
npm run build
```

L'application sera disponible dans le dossier `dist/`

## 🐛 Dépannage

### Le tracker ne détecte pas le simulateur
- Vérifier que le simulateur est lancé
- Vérifier que SimConnect est installé (MSFS/P3D)
- Vérifier les paramètres UDP de X-Plane

### Erreur de connexion à l'API
- Vérifier que le serveur backend est démarré
- Vérifier l'URL dans `src/services/api.js`
- Vérifier les CORS sur le serveur

### Le vol ne démarre pas
- Vérifier qu'une réservation existe
- Vérifier le statut du vol dans la BDD
- Consulter la console développeur (F12)

## 📝 TODO / Améliorations Futures

- [ ] Implémentation complète SimConnect pour MSFS/P3D
- [ ] Implémentation UDP pour X-Plane
- [ ] Carte en temps réel du vol
- [ ] Graphiques de performance
- [ ] Export des rapports en PDF
- [ ] Multi-langue (FR/EN)
- [ ] Mode hors-ligne avec synchronisation
- [ ] Notifications push
- [ ] Integration SimBrief

## 👨‍💻 Développement

### Mode développement
```bash
npm run dev
```

### Variables d'environnement
Créer un fichier `.env` :
```env
NODE_ENV=development
API_URL=http://localhost:3001/api
JWT_SECRET=your-secret-key
```

## 📄 Licence

MIT License - FlyNova © 2025

## 🤝 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe FlyNova

---

**FlyNova ACARS** - Developed with ❤️ for the virtual aviation community
