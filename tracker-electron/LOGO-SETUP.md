# 🎨 Configuration des Logos et Couleurs

## Problème : Les logos ne s'affichent pas

Le tracker ACARS charge les logos depuis la base de données via le champ `logo_url` de la table `virtual_airlines`.

## ✅ Solutions

### Option 1 : URL Complète (Recommandé)

Stockez l'URL complète du logo dans la BDD :

```sql
UPDATE virtual_airlines 
SET logo_url = 'http://localhost:3000/uploads/logos/votre-logo.png'
WHERE id = 1;
```

### Option 2 : Chemin Relatif

Si vous utilisez un chemin relatif, il sera automatiquement préfixé :

```sql
UPDATE virtual_airlines 
SET logo_url = '/uploads/logos/votre-logo.png'
WHERE id = 1;
```

Le tracker ajoutera automatiquement `http://localhost:3000` devant.

### Option 3 : Logo dans le dossier du tracker

Copiez votre logo dans le dossier `tracker-electron/logos/` et utilisez :

```sql
UPDATE virtual_airlines 
SET logo_url = '../../logos/nom-de-votre-logo.png'
WHERE id = 1;
```

## 🎨 Configuration des Couleurs

Les couleurs sont également chargées depuis la base de données. Voici comment les configurer :

### Format des couleurs : Hexadécimal (#RRGGBB)

```sql
UPDATE virtual_airlines 
SET 
  primary_color = '#0066CC',    -- Couleur principale (bleu)
  secondary_color = '#0052A3',  -- Couleur secondaire (bleu foncé)
  accent_color = '#4D94FF',     -- Couleur accent (bleu clair)
  text_on_primary = '#FFFFFF'   -- Couleur texte (blanc)
WHERE id = 1;
```

### Exemples de Palettes

#### Air France (Bleu)
```sql
UPDATE virtual_airlines SET
  primary_color = '#002157',
  secondary_color = '#001A44',
  accent_color = '#0055A4',
  text_on_primary = '#FFFFFF'
WHERE id = 1;
```

#### Emirates (Rouge/Or)
```sql
UPDATE virtual_airlines SET
  primary_color = '#D71921',
  secondary_color = '#A31419',
  accent_color = '#C9A961',
  text_on_primary = '#FFFFFF'
WHERE id = 1;
```

#### Lufthansa (Jaune/Bleu)
```sql
UPDATE virtual_airlines SET
  primary_color = '#F9BA00',
  secondary_color = '#05164D',
  accent_color = '#FFD500',
  text_on_primary = '#05164D'
WHERE id = 1;
```

#### Ryanair (Bleu/Jaune)
```sql
UPDATE virtual_airlines SET
  primary_color = '#073590',
  secondary_color = '#05285F',
  accent_color = '#F1C933',
  text_on_primary = '#FFFFFF'
WHERE id = 1;
```

## 📁 Structure des Fichiers Logo

### Sur le serveur web (Next.js)

```
FlyNova_V2/
└── public/
    └── uploads/
        └── logos/
            ├── airline1.png
            ├── airline2.png
            └── ...
```

### Dans le tracker

```
tracker-electron/
└── logos/
    ├── logo_flynova.png (logo par défaut)
    └── votre-logo.png (optionnel)
```

## 🔧 Vérification

### 1. Vérifier le logo_url dans la BDD

```sql
SELECT id, name, logo_url, primary_color, secondary_color, accent_color
FROM virtual_airlines
WHERE id = 1;
```

### 2. Tester l'URL du logo dans le navigateur

Copiez l'URL du `logo_url` et collez-la dans votre navigateur.
Si l'image s'affiche, c'est bon ! Sinon, vérifiez le chemin.

### 3. Vérifier les logs du tracker

Ouvrez DevTools (F12) dans le tracker et regardez :
- La console pour les erreurs de chargement
- L'onglet Network pour voir si le logo est bien chargé

## 🐛 Dépannage

### Le logo ne s'affiche pas

**Vérifiez :**
1. Le fichier logo existe bien sur le serveur
2. L'URL est correcte dans la BDD
3. Le serveur web est démarré
4. Le CORS autorise le chargement depuis Electron

**Solution temporaire :**
Copiez le logo dans `tracker-electron/logos/` et utilisez un chemin relatif.

### Les couleurs ne s'appliquent pas

**Vérifiez :**
1. Les couleurs sont au format `#RRGGBB` (avec le #)
2. Les couleurs ne sont pas `NULL` dans la BDD
3. F12 > Console pour voir les erreurs

**Solution :**
```sql
UPDATE virtual_airlines 
SET 
  primary_color = '#00c853',
  secondary_color = '#00a843',
  accent_color = '#00ff7f'
WHERE primary_color IS NULL;
```

## 💡 Conseils

### Choix des couleurs

1. **primary_color** : Couleur dominante de votre compagnie
2. **secondary_color** : Version plus foncée de la couleur principale
3. **accent_color** : Couleur pour les éléments d'accentuation
4. **text_on_primary** : Blanc (#FFFFFF) ou Noir (#000000) selon le contraste

### Tester vos couleurs

Utilisez un outil comme :
- https://coolors.co/ - Générateur de palettes
- https://paletton.com/ - Création de schémas de couleurs
- https://colorhunt.co/ - Inspiration de palettes

### Format du logo

**Recommandé :**
- Format : PNG avec transparence
- Dimensions : 200x200px à 500x500px
- Poids : < 100KB
- Fond : Transparent

**Exemple de préparation :**
```bash
# Redimensionner avec ImageMagick
convert logo-original.png -resize 300x300 -background none -gravity center -extent 300x300 logo-final.png
```

## 📋 Checklist Complète

- [ ] Logo uploadé sur le serveur web
- [ ] `logo_url` mis à jour dans la BDD
- [ ] URL testée dans le navigateur
- [ ] `primary_color` défini (format #RRGGBB)
- [ ] `secondary_color` défini
- [ ] `accent_color` défini
- [ ] `text_on_primary` défini
- [ ] Couleurs testées pour le contraste
- [ ] Tracker relancé
- [ ] Logo affiché correctement
- [ ] Couleurs appliquées correctement

---

**Pour vérifier rapidement :** Ouvrez F12 dans le tracker et regardez la console pour voir l'URL du logo chargée.
