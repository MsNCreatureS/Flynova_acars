# 🎨 Guide Visuel - Système de Notifications

## 📱 Aperçu des Notifications

### Toast Notifications (Coins supérieur droit)

```
┌─────────────────────────────────────────┐
│ ✓  Success                              │
│    Operation completed successfully!    │
│                                      × │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✕  Error                                │
│    Something went wrong!                │
│                                      × │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚠  Warning                              │
│    Please check your settings           │
│                                      × │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ℹ  Information                          │
│    New update available                 │
│                                      × │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░   │
└─────────────────────────────────────────┘
```

### Empilage de Notifications

```
┌─────────────────────────┐
│ ✓ Flight started!       │ ← Plus récente
└─────────────────────────┘

┌─────────────────────────┐
│ ℹ Connecting...         │
└─────────────────────────┘

┌─────────────────────────┐
│ ⚠ Low fuel              │ ← Plus ancienne
└─────────────────────────┘
```

## 💬 Modales de Confirmation

### Modale Standard (type: 'confirm')

```
╔═══════════════════════════════════════════╗
║  ┌────┐                                   ║
║  │ ?  │  Confirm Action                   ║
║  └────┘                                   ║
║         Are you sure you want to          ║
║         continue with this action?        ║
║                                           ║
║              [Cancel]  [Confirm] ━━━━━   ║
╚═══════════════════════════════════════════╝
```

### Modale d'Avertissement (type: 'warning')

```
╔═══════════════════════════════════════════╗
║  ┌────┐                                   ║
║  │ ⚠  │  Warning                          ║
║  └────┘                                   ║
║         This action cannot be undone.     ║
║         Do you want to proceed?           ║
║                                           ║
║              [Cancel]  [Confirm] ━━━━━   ║
╚═══════════════════════════════════════════╝
```

### Modale Dangereuse (type: 'error')

```
╔═══════════════════════════════════════════╗
║  ┌────┐                                   ║
║  │ ✕  │  Dangerous Action                 ║
║  └────┘                                   ║
║         This will permanently delete      ║
║         your data. Continue?              ║
║                                           ║
║              [Cancel]  [Delete] ━━━━━━   ║
╚═══════════════════════════════════════════╝
```

## 🎨 Palette de Couleurs

### Success (Vert)
- Background: `#d1fae5` (Vert clair)
- Border: `#10b981` (Vert)
- Icon: `#10b981`

### Error (Rouge)
- Background: `#fee2e2` (Rose clair)
- Border: `#ef4444` (Rouge)
- Icon: `#ef4444`

### Warning (Orange)
- Background: `#fef3c7` (Jaune clair)
- Border: `#f59e0b` (Orange)
- Icon: `#f59e0b`

### Info (Bleu)
- Background: `#dbeafe` (Bleu clair)
- Border: `#3b82f6` (Bleu)
- Icon: `#3b82f6`

## 📐 Dimensions

### Notifications Toast
- **Largeur min**: 320px
- **Largeur max**: 400px
- **Padding**: 16px 20px
- **Border radius**: 12px
- **Shadow**: 0 8px 32px rgba(0, 0, 0, 0.12)

### Modales
- **Largeur max**: 500px
- **Largeur**: 90% (mobile)
- **Border radius**: 16px
- **Shadow**: 0 20px 60px rgba(0, 0, 0, 0.3)

## ⚡ Animations

### Entrée de Notification
```
Transform: translateX(400px) → translateX(0)
Opacity: 0 → 1
Duration: 0.3s
Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Sortie de Notification
```
Transform: translateX(0) → translateX(400px)
Opacity: 1 → 0
Duration: 0.3s
```

### Modale
```
Overlay Opacity: 0 → 1
Modal Scale: 0.9 → 1
Duration: 0.3s
Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

## 🔤 Typographie

### Notification
- **Titre**: 14px, font-weight: 600
- **Message**: 13px, line-height: 1.5

### Modale
- **Titre**: 18px, font-weight: 600
- **Message**: 14px, line-height: 1.6

## 🎯 Positionnement

### Notifications
- **Position**: fixed
- **Top**: 20px
- **Right**: 20px
- **Z-index**: 10000

### Modale
- **Position**: fixed
- **Center**: flex center
- **Z-index**: 9999

## 📱 Responsive

### Desktop (> 768px)
```
Notification width: 320-400px
Modal width: 500px max
Full features
```

### Tablet (768px - 480px)
```
Notification width: 300-350px
Modal width: 90%
Touch-friendly buttons
```

### Mobile (< 480px)
```
Notification width: 90vw
Modal width: 95%
Larger tap targets
```

## 🎭 États Interactifs

### Bouton Hover
```css
transform: translateY(-1px)
box-shadow: 0 4px 12px rgba(...)
opacity: 0.9
```

### Bouton Active
```css
transform: translateY(0)
```

### Close Button Hover
```css
background: #f3f4f6
color: #374151
```

## ✨ Effets Spéciaux

### Barre de Progression
- **Hauteur**: 3px
- **Couleur**: currentColor with opacity 0.3
- **Animation**: linear width transition
- **Position**: bottom of notification

### Backdrop Blur (Modale)
```css
backdrop-filter: blur(4px)
background: rgba(0, 0, 0, 0.5)
```

## 🎬 Séquence d'Utilisation Typique

```
1. Utilisateur clique sur "Start Flight"
   └─> Modale de confirmation apparaît
       └─> Overlay fade in + Modal scale up
       
2. Utilisateur confirme
   └─> Modale disparaît (fade out)
       └─> Notification "Starting..." apparaît (slide in)
       
3. Connexion au simulateur
   └─> Notification "Starting..." se ferme
       └─> Notification "Flight Started!" apparaît
       
4. Auto-close après 5 secondes
   └─> Progress bar se vide
       └─> Notification slide out
```

## 🎨 Exemple de Customisation

```css
/* Changer la position */
.notification-container {
  top: 80px;
  right: 30px;
}

/* Thème sombre personnalisé */
.notification {
  background: #1f2937;
  color: #f9fafb;
}

/* Bouton de confirmation personnalisé */
.modal-btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

**Toutes les mesures sont optimisées pour une expérience utilisateur fluide et moderne! 🎨**
