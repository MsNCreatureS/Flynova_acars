// Discord Rich Presence Service for FlyNova ACARS
// Shows flight information on Discord

const DiscordRPC = require('discord-rpc');

class DiscordPresenceService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.clientId = '1431993217364136007'; // Vous devrez créer une application Discord et remplacer cet ID
    this.flightData = null;
    this.startTimestamp = null;
  }

  /**
   * Initialize Discord Rich Presence
   */
  async connect() {
    if (this.connected) {
      console.log('⚠️ Discord already connected');
      return;
    }

    try {
      this.client = new DiscordRPC.Client({ transport: 'ipc' });

      this.client.on('ready', () => {
        console.log('✅ Discord Rich Presence connected');
        this.connected = true;
      });

      await this.client.login({ clientId: this.clientId });
    } catch (error) {
      console.error('❌ Discord connection failed:', error.message);
      console.log('💡 Discord must be running to show Rich Presence');
      this.connected = false;
    }
  }

  /**
   * Update Discord presence with flight information
   */
  async updatePresence(flightInfo) {
    if (!this.connected || !this.client) {
      return;
    }

    try {
      this.flightData = flightInfo;

      // Set start timestamp on first update
      if (!this.startTimestamp) {
        this.startTimestamp = Date.now();
      }

      const { flight, route, va, phase, currentState } = flightInfo;

      // Build activity details based on flight phase
      let details = '';
      let state = '';
      let largeImageKey = 'logo_transparant'; // Logo uploadé dans Discord Developer Portal
      let largeImageText = 'FlyNova ACARS Tracker';

      // Build flight info
      const flightNumber = route?.flight_number || 'N/A';
      const departure = route?.departure_icao || 'N/A';
      const arrival = route?.arrival_icao || 'N/A';
      const aircraft = currentState?.aircraftType || route?.aircraft_type || 'N/A';
      const vaName = va?.name || 'Virtual Airline';
      const altitude = currentState?.altitude ? Math.round(currentState.altitude) : 0;
      const groundSpeed = currentState?.groundSpeed ? Math.round(currentState.groundSpeed) : 0;

      // Create details based on phase
      switch (phase) {
        case 'Idle':
          details = `Ready to fly`;
          state = `Waiting for flight assignment`;
          break;

        case 'Preflight':
          details = `${flightNumber} | ${departure} → ${arrival}`;
          state = `Preflight - ${aircraft}`;
          break;

        case 'Taxi':
          details = `${flightNumber} | ${departure} → ${arrival}`;
          state = `Taxiing - ${groundSpeed} kts`;
          break;

        case 'Takeoff':
          details = `${flightNumber} | ${departure} → ${arrival}`;
          state = `Takeoff - ${altitude} ft`;
          break;

        case 'Climb':
          details = `${flightNumber} | ${departure} → ${arrival}`;
          state = `Climbing - FL${Math.round(altitude / 100)} | ${groundSpeed} kts`;
          break;

        case 'Cruise':
          details = `${flightNumber} | ${departure} → ${arrival}`;
          state = `Cruising - FL${Math.round(altitude / 100)} | ${groundSpeed} kts`;
          break;

        case 'Descent':
          details = `${flightNumber} | ${departure} → ${arrival}`;
          state = `Descending - FL${Math.round(altitude / 100)} | ${groundSpeed} kts`;
          break;

        case 'Approach':
          details = `${flightNumber} | ${departure} → ${arrival}`;
          state = `Approaching ${arrival} - ${altitude} ft`;
          break;

        case 'Landing':
          details = `${flightNumber} | ${departure} → ${arrival}`;
          state = `Landing at ${arrival}`;
          break;

        case 'Arrived':
          details = `${flightNumber} | ${departure} → ${arrival}`;
          state = `Arrived at ${arrival} ✅`;
          break;

        default:
          details = `${flightNumber} | ${departure} → ${arrival}`;
          state = `Flying - ${aircraft}`;
      }

      const activity = {
        details,
        state,
        startTimestamp: this.startTimestamp,
        largeImageKey,
        largeImageText,
        instance: false
      };

      await this.client.setActivity(activity);
      console.log('✅ Discord presence updated:', phase);
    } catch (error) {
      console.error('❌ Failed to update Discord presence:', error.message);
    }
  }

  /**
   * Clear Discord presence
   */
  async clearPresence() {
    if (!this.connected || !this.client) {
      return;
    }

    try {
      await this.client.clearActivity();
      console.log('✅ Discord presence cleared');
    } catch (error) {
      console.error('❌ Failed to clear Discord presence:', error.message);
    }
  }

  /**
   * Disconnect from Discord
   */
  async disconnect() {
    if (!this.connected || !this.client) {
      return;
    }

    try {
      await this.clearPresence();
      await this.client.destroy();
      this.connected = false;
      this.startTimestamp = null;
      console.log('✅ Discord disconnected');
    } catch (error) {
      console.error('❌ Failed to disconnect Discord:', error.message);
    }
  }
}

// Export singleton instance
const discordPresence = new DiscordPresenceService();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = discordPresence;
}
