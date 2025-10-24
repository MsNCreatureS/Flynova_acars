# Changelog - FlyNova ACARS Tracker

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

---

## [2.0.0] - 2025-10-25

### ✨ Ajouté

#### 🔔 Système de Notifications Moderne
- **Service de notifications** (`src/services/notification.js`)
  - Notifications toast avec 4 types (success, error, warning, info)
  - Modales de confirmation interactives
  - Animations fluides et transitions élégantes
  - Auto-close avec barre de progression
  - Support de notifications multiples empilées
  - Fermeture manuelle ou automatique
  - Personnalisation complète (durée, textes, icônes)

- **Page de démonstration** (`test-notifications.html`)
  - Tests interactifs de tous les types de notifications
  - Exemples de cas d'usage réels
  - Démonstration des modales
  - Code d'exemple pour chaque fonctionnalité

- **Documentation complète**
  - `NOTIFICATIONS-README.md` - Guide d'installation
  - `NOTIFICATION-SYSTEM.md` - Documentation API
  - `NOTIFICATION-VISUAL-GUIDE.md` - Guide visuel et design
  - `NOTIFICATION-COMPLETE.md` - Récapitulatif final

### 🔄 Modifié

#### Dashboard (`src/pages/dashboard.html`)
- Remplacement de **7 `alert()`** par des notifications modernes :
  - Vol démarré → Success notification
  - Erreur démarrage → Error notification
  - Erreur SimConnect → Error notification détaillée
  - Vol terminé → Success notification avec message personnalisé
  - Erreur rapport → Error notification
  - Vol annulé → Warning notification
  - Erreur annulation → Error notification

- Remplacement de **4 `confirm()`** par des modales interactives :
  - Déconnexion → Modale de confirmation warning
  - Démarrage vol → Modale confirm avec contexte
  - Fin de vol → Modale confirm avec instructions
  - Annulation vol → Modale error avec avertissement fort

#### README.md
- Ajout de la section "Système de Notifications"
- Mise à jour de la structure du projet
- Mise à jour des fonctionnalités
- Ajout dans TODO (marqué comme terminé)

### 🎨 Améliorations UX

- **Messages plus clairs** : Textes détaillés et contextuels
- **Feedback visuel** : Animations et transitions fluides
- **Meilleure accessibilité** : Fermeture avec ESC, focus clavier
- **Design cohérent** : S'adapte aux couleurs de la VA
- **Responsive** : Fonctionne sur tous les écrans

### 📦 Fichiers Créés

1. `src/services/notification.js` - Service principal (15KB)
2. `test-notifications.html` - Démo interactive
3. `NOTIFICATIONS-README.md` - Guide rapide
4. `NOTIFICATION-SYSTEM.md` - Doc API complète
5. `NOTIFICATION-VISUAL-GUIDE.md` - Guide visuel
6. `NOTIFICATION-COMPLETE.md` - Récapitulatif
7. `CHANGELOG.md` - Ce fichier

### 🐛 Corrigé

- Suppression des alertes natives peu esthétiques
- Suppression des confirmations natives bloquantes
- Amélioration de la gestion des erreurs avec messages détaillés

### 💡 Impact

- **Expérience utilisateur** : Nettement améliorée
- **Design** : Plus moderne et professionnel
- **Feedback** : Plus clair et contextuel
- **Maintenance** : Code plus propre et réutilisable

---

## [1.0.0] - 2025-10-24

### ✨ Ajouté

- Interface de connexion avec authentification
- Dashboard avec affichage de la réservation active
- Service de tracking de vol
- Support théorique MSFS, X-Plane, P3D
- Branding automatique des VA (couleurs + logo)
- Affichage des informations de vol
- Boutons de contrôle (start, end, cancel)
- Service API avec tous les endpoints
- Système de rapport de vol
- Gestion des phases de vol
- Affichage de la progression

### 🎨 Design

- Thème sombre avec couleurs FlyNova
- Interface moderne et élégante
- Animations CSS
- Logo et branding VA
- Responsive design basique

### 🔐 Sécurité

- Authentification JWT
- Hash des mots de passe avec bcrypt
- Validation des tokens
- Protection des routes

---

## Types de Changements

- ✨ **Ajouté** : Nouvelles fonctionnalités
- 🔄 **Modifié** : Modifications de fonctionnalités existantes
- 🐛 **Corrigé** : Corrections de bugs
- ⚠️ **Déprécié** : Fonctionnalités qui seront supprimées
- ❌ **Supprimé** : Fonctionnalités supprimées
- 🔐 **Sécurité** : Correctifs de sécurité
- 🎨 **Design** : Changements visuels
- 📝 **Documentation** : Changements de documentation
- ⚡ **Performance** : Améliorations de performance

---

## Prochaines Versions (Planifié)

### [2.1.0] - À venir
- Implémentation complète SimConnect pour MSFS
- Implémentation UDP pour X-Plane
- Carte en temps réel du vol
- Graphiques de performance

### [2.2.0] - À venir
- Export des rapports en PDF
- Multi-langue (FR/EN)
- Mode hors-ligne avec synchronisation

### [3.0.0] - À venir
- Intégration SimBrief
- Planification de vol
- Weather briefing
- Checklist interactive

---

**Note** : Ce changelog suit le format [Keep a Changelog](https://keepachangelog.com/)
et ce projet adhère au [Semantic Versioning](https://semver.org/).
