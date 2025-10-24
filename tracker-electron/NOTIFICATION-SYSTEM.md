# 🔔 Système de Notifications Moderne

Ce document explique comment utiliser le nouveau système de notifications et pop-ups qui remplace les `alert()` et `confirm()` natifs.

## 📋 Table des matières

1. [Installation](#installation)
2. [Notifications](#notifications)
3. [Modales de Confirmation](#modales-de-confirmation)
4. [Exemples d'utilisation](#exemples-dutilisation)
5. [Personnalisation](#personnalisation)

---

## 🚀 Installation

### Inclure le service dans vos pages HTML

```html
<script src="../services/notification.js"></script>
```

Le service s'initialise automatiquement et crée une instance globale `Notification`.

---

## 📨 Notifications

Les notifications sont des messages temporaires qui apparaissent en haut à droite de l'écran.

### Types de notifications

#### 1. Success (Succès)
```javascript
Notification.success('Operation completed successfully!');
Notification.success('Flight started!', 'Success');
```

#### 2. Error (Erreur)
```javascript
Notification.error('Something went wrong!');
Notification.error('Failed to connect to server', 'Connection Error');
```

#### 3. Warning (Avertissement)
```javascript
Notification.warning('Please check your settings');
Notification.warning('Low fuel detected', 'Warning');
```

#### 4. Info (Information)
```javascript
Notification.info('New update available');
Notification.info('Flight phase changed to cruise', 'Information');
```

### Méthode générique

```javascript
Notification.notify(message, type, title, duration);
```

**Paramètres:**
- `message` (string) - Le message à afficher
- `type` (string) - 'success', 'error', 'warning', ou 'info'
- `title` (string, optionnel) - Titre personnalisé
- `duration` (number, optionnel) - Durée en ms (par défaut: 5000, 0 = pas de fermeture auto)

**Exemple:**
```javascript
Notification.notify(
  'Your flight has been updated',
  'info',
  'Flight Update',
  3000
);
```

---

## ⚠️ Modales de Confirmation

Les modales remplacent `confirm()` et `alert()` pour les actions importantes.

### Syntaxe de base

```javascript
const confirmed = await Notification.confirm(
  'Are you sure you want to delete this?',
  {
    title: 'Confirm Delete',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  }
);

if (confirmed) {
  // L'utilisateur a confirmé
} else {
  // L'utilisateur a annulé
}
```

### Options disponibles

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `title` | string | 'Confirm Action' | Titre de la modale |
| `confirmText` | string | 'Confirm' | Texte du bouton de confirmation |
| `cancelText` | string | 'Cancel' | Texte du bouton d'annulation |
| `type` | string | 'confirm' | Type: 'confirm', 'warning', ou 'error' |
| `icon` | string | Auto | Icône personnalisée (emoji ou texte) |

### Types de modales

#### Confirmation Standard
```javascript
await Notification.confirm(
  'Continue with this action?',
  { type: 'confirm' }
);
```

#### Avertissement
```javascript
await Notification.confirm(
  'This action cannot be undone',
  { type: 'warning' }
);
```

#### Action Dangereuse
```javascript
await Notification.confirm(
  'This will permanently delete your data',
  { 
    type: 'error',
    confirmText: 'Yes, Delete',
    cancelText: 'Keep It'
  }
);
```

---

## 💡 Exemples d'utilisation

### Exemple 1: Démarrage de vol

```javascript
async function startFlight() {
  const confirmed = await Notification.confirm(
    'Ready to start your flight?',
    {
      title: 'Start Flight',
      confirmText: 'Start',
      cancelText: 'Not Yet',
      type: 'confirm'
    }
  );

  if (confirmed) {
    try {
      await APIService.startFlight();
      Notification.success('Flight started successfully!', 'Ready for Takeoff');
    } catch (error) {
      Notification.error(error.message, 'Failed to Start');
    }
  }
}
```

### Exemple 2: Annulation avec avertissement

```javascript
async function cancelReservation() {
  const confirmed = await Notification.confirm(
    'Cancelling this reservation cannot be undone. Continue?',
    {
      title: 'Cancel Reservation',
      confirmText: 'Yes, Cancel',
      cancelText: 'Keep It',
      type: 'error',
      icon: '⚠'
    }
  );

  if (confirmed) {
    await APIService.cancel();
    Notification.warning('Reservation cancelled', 'Cancelled');
  }
}
```

### Exemple 3: Validation de formulaire

```javascript
async function submitForm() {
  try {
    await APIService.submitData(formData);
    Notification.success('Data saved successfully!');
    
    // Rediriger après 1 seconde
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  } catch (error) {
    Notification.error('Please check your input', 'Validation Error');
  }
}
```

### Exemple 4: Notification longue durée

```javascript
// Notification qui reste affichée pendant 10 secondes
Notification.info(
  'Your flight report is being processed. This may take a few moments.',
  'Processing',
  10000
);
```

### Exemple 5: Notification permanente

```javascript
// Notification qui ne se ferme pas automatiquement
const notification = Notification.notify(
  'Download in progress...',
  'info',
  'Downloading',
  0  // 0 = pas de fermeture auto
);

// Fermer manuellement plus tard
setTimeout(() => {
  notification.remove();
}, 5000);
```

---

## 🎨 Personnalisation

### Modifier les couleurs

Les couleurs s'adaptent automatiquement aux variables CSS de votre VA:

```css
:root {
  --primary-color: #3b82f6;  /* Couleur principale */
  --secondary-color: #8b5cf6;
  --accent-color: #10b981;
}
```

### Personnaliser les styles

Vous pouvez surcharger les styles dans votre fichier CSS:

```css
/* Personnaliser la position des notifications */
.notification-container {
  top: 80px;  /* Descendre les notifications */
  right: 30px;
}

/* Modifier l'apparence des notifications */
.notification {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Personnaliser les boutons de modale */
.modal-btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

## ⌨️ Raccourcis clavier

- **ESC** - Fermer la modale de confirmation (équivaut à "Cancel")
- **Clic sur overlay** - Fermer la modale
- **× (bouton)** - Fermer une notification manuellement

---

## 🔄 Migration depuis alert() et confirm()

### Ancien code
```javascript
alert('Flight started!');

if (confirm('Delete this?')) {
  deleteItem();
}
```

### Nouveau code
```javascript
Notification.success('Flight started!');

if (await Notification.confirm('Delete this?')) {
  deleteItem();
}
```

**Note:** `Notification.confirm()` retourne une **Promise**, donc utilisez `await` ou `.then()`.

---

## 📱 Responsive Design

Les notifications et modales sont entièrement responsive:
- Sur mobile, les notifications prennent toute la largeur
- Les modales s'adaptent à la taille de l'écran
- Touch-friendly avec de grandes zones tactiles

---

## ✨ Fonctionnalités

- ✅ Design moderne et élégant
- ✅ Animations fluides
- ✅ Barre de progression
- ✅ Empilage automatique des notifications
- ✅ Fermeture automatique configurable
- ✅ Support des icônes personnalisées
- ✅ Accessible au clavier
- ✅ Pas de dépendances externes
- ✅ Compatible avec tous les navigateurs modernes

---

## 🐛 Débogage

Pour voir les notifications dans la console:

```javascript
// Activer le mode debug
Notification.debug = true;

// Toutes les notifications seront loguées
Notification.success('Test'); // Console: "[Notification] Success: Test"
```

---

## 📝 Notes importantes

1. **Async/Await**: Les modales de confirmation sont asynchrones, utilisez toujours `await` ou `.then()`
2. **Z-Index**: Les notifications utilisent `z-index: 10000`, assurez-vous qu'aucun élément n'est au-dessus
3. **Performance**: Les notifications sont automatiquement supprimées du DOM après fermeture
4. **Accessibilité**: Les modales peuvent être fermées avec ESC pour l'accessibilité clavier

---

## 🆘 Support

Si vous rencontrez des problèmes:
1. Vérifiez que `notification.js` est bien chargé
2. Ouvrez la console du navigateur pour voir les erreurs
3. Vérifiez que vous utilisez `await` avec `confirm()`

**Bon vol! ✈️**
