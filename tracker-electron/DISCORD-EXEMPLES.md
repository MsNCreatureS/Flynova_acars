# 🎨 Exemples Visuels - Discord Rich Presence

## 📱 Ce que vos amis verront sur Discord

### Exemple 1: Phase de Croisière

```
┌────────────────────────────────────┐
│ 🛫 FlyNova ACARS                   │
├────────────────────────────────────┤
│ [LOGO]  FLY001 | LFPG → KJFK      │
│         Cruising - FL350 | 450 kts │
│         ⏱️ Elapsed: 2:34:12        │
│                                     │
│         [🛫 FlyNova Virtual Airlines]│
└────────────────────────────────────┘
```

### Exemple 2: Phase de Décollage

```
┌────────────────────────────────────┐
│ 🛫 FlyNova ACARS                   │
├────────────────────────────────────┤
│ [LOGO]  AF001 | LFPG → EGLL       │
│         Takeoff - 2500 ft          │
│         ⏱️ Elapsed: 0:08:45        │
│                                     │
│         [🛫 Air France Virtual]     │
└────────────────────────────────────┘
```

### Exemple 3: En Approche

```
┌────────────────────────────────────┐
│ 🛫 FlyNova ACARS                   │
├────────────────────────────────────┤
│ [LOGO]  LH456 | EDDF → LOWW       │
│         Approaching LOWW - 3500 ft │
│         ⏱️ Elapsed: 1:12:34        │
│                                     │
│         [🛫 Lufthansa Virtual]      │
└────────────────────────────────────┘
```

### Exemple 4: Arrivé à Destination

```
┌────────────────────────────────────┐
│ 🛫 FlyNova ACARS                   │
├────────────────────────────────────┤
│ [LOGO]  BA123 | EGLL → KJFK       │
│         Arrived at KJFK ✅         │
│         ⏱️ Elapsed: 7:23:15        │
│                                     │
│         [🛫 British Airways VA]     │
└────────────────────────────────────┘
```

---

## 🎯 Détails par Phase de Vol

### 🛫 Preflight (Préparation)
```
Details: FLY001 | LFPG → KJFK
State:   Preflight - Boeing 777-300ER
```

### 🚕 Taxi (Roulage)
```
Details: FLY001 | LFPG → KJFK
State:   Taxiing - 15 kts
```

### 🛫 Takeoff (Décollage)
```
Details: FLY001 | LFPG → KJFK
State:   Takeoff - 1250 ft
```

### ⬆️ Climb (Montée)
```
Details: FLY001 | LFPG → KJFK
State:   Climbing - FL180 | 320 kts
```

### ✈️ Cruise (Croisière)
```
Details: FLY001 | LFPG → KJFK
State:   Cruising - FL350 | 450 kts
```

### ⬇️ Descent (Descente)
```
Details: FLY001 | LFPG → KJFK
State:   Descending - FL150 | 280 kts
```

### 🎯 Approach (Approche)
```
Details: FLY001 | LFPG → KJFK
State:   Approaching KJFK - 2500 ft
```

### 🛬 Landing (Atterrissage)
```
Details: FLY001 | LFPG → KJFK
State:   Landing at KJFK
```

### ✅ Arrived (Arrivé)
```
Details: FLY001 | LFPG → KJFK
State:   Arrived at KJFK ✅
```

---

## 🖼️ Exemples d'Icônes Recommandées

### Structure des Images

```
Discord Developer Portal
└── Rich Presence
    └── Art Assets
        ├── flynova_logo (1024x1024)    ← Logo principal
        ├── preflight (512x512)         ← Avion au sol
        ├── taxi (512x512)              ← Avion en mouvement sol
        ├── takeoff (512x512)           ← Avion décollant
        ├── climb (512x512)             ← Avion montant
        ├── cruise (512x512)            ← Avion en palier
        ├── descent (512x512)           ← Avion descendant
        ├── approach (512x512)          ← Avion en approche
        ├── landing (512x512)           ← Avion atterrissant
        ├── arrived (512x512)           ← Check mark vert
        └── airplane (512x512)          ← Icône générique
```

### Descriptions Visuelles des Icônes

**flynova_logo** (Grande Image - Toujours Visible)
```
┌─────────────┐
│             │
│   ✈️ LOGO   │   Votre logo de VA
│   FLYNOVA   │   Taille: 1024x1024 px
│             │   Format: PNG transparent
└─────────────┘
```

**preflight** (Petite Image)
```
┌────────┐
│  📋✈   │   Avion au sol avec checklist
└────────┘   Couleur: Bleu/Gris
```

**taxi** (Petite Image)
```
┌────────┐
│  ✈➡️   │   Avion roulant au sol
└────────┘   Couleur: Jaune/Orange
```

**takeoff** (Petite Image)
```
┌────────┐
│   ✈↗️  │   Avion en phase de décollage
└────────┘   Couleur: Orange vif
```

**climb** (Petite Image)
```
┌────────┐
│   ✈⬆️  │   Avion montant vers le ciel
└────────┘   Couleur: Bleu ciel
```

**cruise** (Petite Image)
```
┌────────┐
│   ✈➡️  │   Avion en vol stable
└────────┘   Couleur: Bleu océan
```

**descent** (Petite Image)
```
┌────────┐
│   ✈⬇️  │   Avion descendant
└────────┘   Couleur: Bleu foncé
```

**approach** (Petite Image)
```
┌────────┐
│   ✈🎯  │   Avion approchant piste
└────────┘   Couleur: Violet
```

**landing** (Petite Image)
```
┌────────┐
│   ✈⬇️  │   Avion atterrissant
└────────┘   Couleur: Vert clair
```

**arrived** (Petite Image)
```
┌────────┐
│   ✈✅  │   Avion arrivé avec check
└────────┘   Couleur: Vert foncé
```

---

## 🎨 Palette de Couleurs Recommandée

### Couleurs FlyNova (pour cohérence)

```css
Primaire:   #1E88E5  (Bleu vif)
Secondaire: #0D47A1  (Bleu foncé)
Accent:     #FFA726  (Orange)
Succès:     #66BB6A  (Vert)
Warning:    #FFA726  (Orange)
Danger:     #EF5350  (Rouge)
```

### Couleurs par Phase

| Phase     | Couleur   | Hex     | Signification    |
|-----------|-----------|---------|------------------|
| Preflight | Gris      | #9E9E9E | Préparation      |
| Taxi      | Jaune     | #FFEB3B | Attention        |
| Takeoff   | Orange    | #FF9800 | Critique         |
| Climb     | Bleu ciel | #03A9F4 | Ascension        |
| Cruise    | Bleu      | #1E88E5 | Stable           |
| Descent   | Indigo    | #3F51B5 | Descente         |
| Approach  | Violet    | #9C27B0 | Concentration    |
| Landing   | Vert clair| #8BC34A | Presque arrivé   |
| Arrived   | Vert      | #4CAF50 | Succès           |

---

## 💡 Conseils de Design

### Pour le Logo Principal
- ✅ Format carré (1024x1024 px)
- ✅ Fond transparent (PNG)
- ✅ Logo bien centré
- ✅ Contraste élevé
- ❌ Pas de texte trop petit
- ❌ Pas de détails fins (sera réduit)

### Pour les Icônes de Phase
- ✅ Format carré (512x512 px minimum)
- ✅ Icônes simples et reconnaissables
- ✅ Couleurs distinctes par phase
- ✅ Style cohérent entre toutes les icônes
- ❌ Pas trop de détails
- ❌ Pas de texte

---

## 🔧 Outils pour Créer les Icônes

### Gratuits
1. **Canva** (https://www.canva.com)
   - Templates d'icônes disponibles
   - Export PNG transparent
   - Facile à utiliser

2. **Figma** (https://www.figma.com)
   - Professionnel
   - Gratuit pour usage personnel
   - Export haute qualité

3. **GIMP** (https://www.gimp.org)
   - Logiciel libre
   - Puissant comme Photoshop
   - Export PNG transparent

### Icônes Gratuites
1. **Font Awesome** (https://fontawesome.com)
   - Icônes avion gratuites
   - Format SVG (convertible en PNG)

2. **Flaticon** (https://www.flaticon.com)
   - Milliers d'icônes avion
   - Téléchargement PNG direct

3. **Noun Project** (https://thenounproject.com)
   - Icônes professionnelles
   - Version gratuite disponible

---

## 📸 Aperçu dans Discord

### Sur PC (Desktop)
```
┌─────────────────────────────────────────────┐
│  [Avatar]                                   │
│  Username                          [Status] │
│  ┌──────────────────────────────────────┐   │
│  │ 🛫 FlyNova ACARS                     │   │
│  │ ┌──────┐  FLY001 | LFPG → KJFK      │   │
│  │ │ LOGO │  Cruising - FL350 | 450 kts │   │
│  │ │      │  ⏱️ Elapsed: 2:34:12         │   │
│  │ └──────┘  [🛫 FlyNova Virtual Airlines]│   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Sur Mobile
```
┌──────────────────────┐
│ [Avatar] Username    │
│ Playing FlyNova ACARS│
│ FLY001 | LFPG → KJFK │
│ Cruising - FL350     │
└──────────────────────┘
```

---

## ✨ Exemples de Vols Réels

### Vol Court-Courrier
```
🛫 FlyNova ACARS
FLY123 | LFPG → LFLL
Descent - FL80 | 220 kts
⏱️ 0:52:30
```

### Vol Moyen-Courrier
```
🛫 FlyNova ACARS
FLY456 | EGLL → LEMD
Cruise - FL380 | 480 kts
⏱️ 1:45:20
```

### Vol Long-Courrier
```
🛫 FlyNova ACARS
FLY789 | KJFK → RJTT
Cruise - FL390 | 520 kts
⏱️ 12:34:56
```

### Vol Cargo
```
🛫 FlyNova ACARS
CARGO42 | PANC → PHNL
Approach - 5500 ft
⏱️ 4:23:11
```

---

## 🎉 Résultat Final

Vos amis sur Discord verront :
- ✅ Que vous êtes en vol
- ✅ Votre numéro de vol
- ✅ Votre route
- ✅ Votre phase de vol actuelle
- ✅ Votre altitude et vitesse
- ✅ Depuis combien de temps vous volez
- ✅ Un lien cliquable vers votre VA

**C'est professionnel, stylé et informatif ! ✈️**

---

**Prêt à impressionner vos amis sur Discord ? Configurez maintenant ! 🚀**

Consultez **DISCORD-SETUP.md** pour les instructions complètes.
