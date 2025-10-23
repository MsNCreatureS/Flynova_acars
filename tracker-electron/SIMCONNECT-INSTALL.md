# Guide d'Installation SimConnect pour MSFS 2020

## 📋 Prérequis

- MSFS 2020 installé
- Node.js 18+ installé
- Visual Studio Build Tools (pour compiler le module natif)

## 🔧 Installation

### Étape 1 : Installer les dépendances de build

```bash
# Installer windows-build-tools (en tant qu'administrateur)
npm install --global windows-build-tools

# OU installer Visual Studio Build Tools manuellement
# Télécharger depuis : https://visualstudio.microsoft.com/downloads/
# Sélectionner "Desktop development with C++"
```

### Étape 2 : Installer node-simconnect

```bash
cd tracker-electron
npm install node-simconnect
```

### Étape 3 : Vérifier l'installation SimConnect SDK

Le SDK SimConnect doit être installé avec MSFS 2020.
Emplacement par défaut :
```
C:\MSFS SDK\SimConnect SDK
```

Si non installé, l'installer depuis le Microsoft Flight Simulator SDK.

## 🚀 Utilisation

Le tracker détectera automatiquement MSFS et se connectera via SimConnect.

---

**Note:** Si l'installation échoue, le mode simulation reste disponible pour les tests.
