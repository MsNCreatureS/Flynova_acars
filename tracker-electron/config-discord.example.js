/**
 * EXEMPLE DE CONFIGURATION DISCORD RICH PRESENCE
 * Copiez ce fichier en config-discord.js et personnalisez-le
 */

module.exports = {
  // 🔑 OBLIGATOIRE: Votre Client ID depuis Discord Developer Portal
  // 1. Allez sur https://discord.com/developers/applications
  // 2. Créez une nouvelle application "FlyNova ACARS"
  // 3. Copiez l'Application ID
  clientId: '1234567890123456789', // ⚠️ REMPLACEZ PAR VOTRE CLIENT ID

  // 🌐 URL de votre compagnie virtuelle (affiché dans le bouton Discord)
  vaUrl: 'https://flynova.com', // Remplacez par votre URL

  // 🎨 Noms des images dans Discord Developer Portal → Rich Presence → Art Assets
  // Ces noms doivent correspondre EXACTEMENT aux noms uploadés
  images: {
    // Image principale (logo)
    largeImage: 'flynova_logo',
    
    // Icônes pour chaque phase de vol
    phases: {
      preflight: 'preflight',
      taxi: 'taxi',
      takeoff: 'takeoff',
      climb: 'climb',
      cruise: 'cruise',
      descent: 'descent',
      approach: 'approach',
      landing: 'landing',
      arrived: 'arrived',
      default: 'airplane'
    }
  },

  // 📝 Textes personnalisés
  texts: {
    // Texte sur le logo principal
    largeImageText: 'FlyNova ACARS Tracker',
    
    // Label du bouton
    buttonLabel: '🛫 Visitez FlyNova'
  },

  // ⚙️ Options avancées
  options: {
    // Mettre à jour Discord toutes les X secondes
    updateInterval: 1, // 1 = chaque seconde (recommandé)
    
    // Afficher le timer de vol
    showTimer: true,
    
    // Afficher le bouton
    showButton: true
  }
};

/**
 * 📋 CHECKLIST DE CONFIGURATION
 * 
 * □ Créer une application Discord
 * □ Copier le Client ID
 * □ Remplacer clientId ci-dessus
 * □ Uploader le logo principal (512x512 px) nommé 'flynova_logo'
 * □ Uploader les icônes de phase (optionnel mais recommandé)
 * □ Remplacer vaUrl par l'URL de votre VA
 * □ Tester avec Discord ouvert
 * 
 * 🎨 ICÔNES RECOMMANDÉES:
 * 
 * Pour chaque phase, uploadez une icône 512x512 px :
 * - preflight.png : Avion au sol avec checklist
 * - taxi.png : Avion en mouvement au sol
 * - takeoff.png : Avion en décollage
 * - climb.png : Avion montant
 * - cruise.png : Avion en palier
 * - descent.png : Avion descendant
 * - approach.png : Avion en approche
 * - landing.png : Avion atterrissant
 * - arrived.png : Avion arrivé avec check mark
 * 
 * 💡 ASTUCE: Utilisez des icônes avec fond transparent (PNG)
 * 
 * 📦 RESSOURCES POUR ICÔNES:
 * - https://www.flaticon.com (recherchez "airplane")
 * - https://fontawesome.com (icônes gratuits)
 * - Créez les vôtres avec Canva ou Photoshop
 */
