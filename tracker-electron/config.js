/**
 * Configuration pour le tracker FlyNova ACARS
 * 
 * Modifier ces valeurs selon votre environnement
 */

const CONFIG = {
  // URL de votre API backend (mode développement)
  API_BASE_URL: process.env.API_URL || 'https://flynova-backend-developpmeny.up.railway.app/api',
  
  // Intervalle de mise à jour du tracker (en ms)
  UPDATE_INTERVAL: 1000, // 1 seconde
  
  // Intervalle d'envoi de télémétrie (en ms)
  TELEMETRY_INTERVAL: 30000, // 30 secondes
  
  // SimConnect configuration (MSFS/P3D)
  SIMCONNECT: {
    enabled: true,
    port: 500,
    host: 'localhost'
  },
  
  // X-Plane UDP configuration
  XPLANE: {
    enabled: true,
    port: 49000,
    host: 'localhost'
  },
  
  // Mode simulation (pour tests sans simulateur)
  SIMULATION_MODE: {
    enabled: true, // Activé par défaut si aucun simulateur détecté
    flight_duration: 120 // minutes
  },
  
  // Points système
  POINTS: {
    base: 100,
    per_hour: 10,
    smooth_landing_bonus: 50, // Si landing rate < 600 fpm
    smooth_landing_threshold: 600 // fpm
  },
  
  // Phases de vol
  FLIGHT_PHASES: {
    PREFLIGHT: 'Preflight',
    TAXI: 'Taxi',
    TAKEOFF: 'Takeoff',
    CLIMB: 'Climb',
    CRUISE: 'Cruise',
    DESCENT: 'Descent',
    APPROACH: 'Approach',
    LANDING: 'Landing',
    ARRIVED: 'Arrived'
  },
  
  // Limites de télémétrie
  TELEMETRY: {
    max_points: 10000, // Nombre max de points stockés
    send_interval: 30000 // Envoi toutes les 30 secondes
  }
};

// Export pour Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
