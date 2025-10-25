/**
 * Configuration Environnement - FlyNova ACARS
 * 
 * Ce fichier permet de basculer facilement entre dev et production
 */

// ⚙️ CONFIGURATION ACTIVE
const ENVIRONMENT = 'production'; // 'development' ou 'production'

// 🌐 URLs des Environnements
const ENVIRONMENTS = {
  development: {
    API_BASE_URL: 'http://localhost:3001/api/acars',
    ASSETS_URL: 'http://localhost:3000',
    NAME: 'Développement Local'
  },
  production: {
    API_BASE_URL: 'https://flynova-backend-production.up.railway.app/api/acars',
    ASSETS_URL: 'https://flynova-backend-production.up.railway.app',
    NAME: 'Production Railway'
  }
};

// 📦 Configuration Active
const ENV_CONFIG = ENVIRONMENTS[ENVIRONMENT];

// 🔍 Log de l'environnement
console.log(`🌐 Environment: ${ENV_CONFIG.NAME}`);
console.log(`📡 API: ${ENV_CONFIG.API_BASE_URL}`);

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ENV_CONFIG;
}

// Global pour le navigateur
if (typeof window !== 'undefined') {
  window.ENV_CONFIG = ENV_CONFIG;
}
