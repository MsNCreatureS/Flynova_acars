// Flight Tracker Service
// Supports MSFS, X-Plane, and P3D

// Discord sera mis à jour via IPC vers le main process
const { ipcRenderer } = require('electron');

class FlightTracker {
  constructor(flight, token) {
    this.flight = flight;
    this.token = token;
    this.isTracking = false;
    this.updateInterval = null;
    this.telemetryInterval = null;
    this.simulator = null;
    this.discordEnabled = false;
    
    // Get aircraft from fleet reservation
    let aircraftType = 'Unknown Aircraft';
    if (flight.fleet) {
      // Priorité: aircraft_name > aircraft_type > registration
      aircraftType = flight.fleet.aircraft_name || 
                     flight.fleet.aircraft_type || 
                     flight.fleet.registration || 
                     'Unknown Aircraft';
      
      // Si on a le registration, on l'ajoute
      if (flight.fleet.registration && flight.fleet.aircraft_name) {
        aircraftType = `${flight.fleet.aircraft_name} (${flight.fleet.registration})`;
      } else if (flight.fleet.registration && flight.fleet.aircraft_type) {
        aircraftType = `${flight.fleet.aircraft_type} (${flight.fleet.registration})`;
      }
    }
    
    console.log('✈️ Aircraft from fleet:', aircraftType, flight.fleet);
    
    // Flight data
    this.flightData = {
      departureTime: null,
      arrivalTime: null,
      duration: 0,
      distanceFlown: 0,
      fuelUsed: 0,
      landingRate: 0,
      maxAltitude: 0,
      maxSpeed: 0,
      telemetry: [],
      phase: 'Preflight'
    };

    // Current state
    this.currentState = {
      latitude: 0,
      longitude: 0,
      altitude: 0,
      groundSpeed: 0,
      heading: 0,
      verticalSpeed: 0,
      onGround: true,
      fuel: 0,
      aircraftType: aircraftType
    };

    this.lastState = { ...this.currentState };
    this.hasStarted = false;
    this.hasLanded = false;
    this.touchdownDetected = false; // Track if touchdown has been captured

    this.onUpdate = null;
    this.telemetryCounter = 0; // Counter for telemetry storage (every 20 seconds)
  }

  async start() {
    console.log('Starting flight tracker...');
    this.isTracking = true;

    // Detect simulator
    await this.detectSimulator();

    // Discord Rich Presence sera mis à jour via IPC
    this.discordEnabled = true;
    console.log('✅ Discord Rich Presence will update during flight');

    // Start tracking loop
    this.updateInterval = setInterval(() => this.update(), 1000);
    
    // Send telemetry every 30 seconds
    this.telemetryInterval = setInterval(() => this.sendTelemetry(), 30000);

    // Initialize flight start time
    if (!this.flightData.departureTime) {
      this.flightData.departureTime = new Date();
    }
  }

  stop() {
    console.log('Stopping flight tracker...');
    this.isTracking = false;

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
      this.telemetryInterval = null;
    }

    if (this.simulator) {
      this.simulator.disconnect();
    }

    // Remettre Discord en mode Idle via IPC
    if (this.discordEnabled) {
      ipcRenderer.invoke('discord-update', {
        flight: {},
        route: { flight_number: 'FlyNova ACARS', departure_icao: '', arrival_icao: '' },
        va: { name: 'FlyNova' },
        phase: 'Idle',
        currentState: { aircraftType: 'Ready to fly', altitude: 0, groundSpeed: 0 }
      }).catch(err => console.log('⚠️ Discord IPC update failed:', err.message));
      this.discordEnabled = false;
    }
  }

  async detectSimulator() {
    // Try MSFS first (SimConnect)
    try {
      this.simulator = new MSFSConnector();
      await this.simulator.connect();
      console.log('Connected to MSFS');
      return;
    } catch (e) {
      console.log('MSFS not detected');
    }

    // Try X-Plane
    try {
      this.simulator = new XPlaneConnector();
      await this.simulator.connect();
      console.log('Connected to X-Plane');
      return;
    } catch (e) {
      console.log('X-Plane not detected');
    }

    // Try P3D
    try {
      this.simulator = new P3DConnector();
      await this.simulator.connect();
      console.log('Connected to P3D');
      return;
    } catch (e) {
      console.log('P3D not detected');
    }

    // No simulator available - throw error
    throw new Error('❌ No simulator detected!\n\n⚠️ Please launch MSFS 2020, X-Plane or P3D before starting the flight.\n\n💡 The simulator must be in flight (not in main menu).');
  }

  async update() {
    if (!this.isTracking || !this.simulator) return;

    try {
      // Get current flight data from simulator
      const data = await this.simulator.getData();
      
      // Save previous state BEFORE updating
      const previousState = this.lastState ? { ...this.lastState } : null;
      
      // Update current state (keep aircraft type from reservation)
      const aircraftType = this.currentState.aircraftType;
      this.currentState = { ...data, aircraftType };

      // Debug: Log state transitions
      if (previousState && previousState.onGround !== this.currentState.onGround) {
        console.log('🔄 Ground state changed:', {
          from: previousState.onGround ? 'ON GROUND' : 'IN AIR',
          to: this.currentState.onGround ? 'ON GROUND' : 'IN AIR',
          altitude: this.currentState.altitude,
          vs: this.currentState.verticalSpeed,
          previousVS: previousState.verticalSpeed
        });
      }

      // Detect touchdown FIRST (before phase changes)
      if (previousState && !previousState.onGround && this.currentState.onGround && !this.touchdownDetected) {
        const touchdownVS = Math.abs(previousState.verticalSpeed);
        
        if (touchdownVS > 0 && touchdownVS < 2000) {
          this.flightData.landingRate = touchdownVS;
          this.touchdownDetected = true;
          
          console.log('🛬🛬🛬 TOUCHDOWN DETECTED! 🛬🛬🛬');
          console.log('   Landing Rate:', touchdownVS.toFixed(2), 'fpm');
          console.log('   Last altitude:', previousState.altitude, 'ft');
          console.log('   Ground speed:', this.currentState.groundSpeed, 'kts');
          console.log('   Previous VS:', previousState.verticalSpeed);
          console.log('   Was on ground:', previousState.onGround);
          console.log('   Now on ground:', this.currentState.onGround);
        }
      }

      // Calculate flight progress
      this.calculateProgress();

      // Detect flight phases
      this.detectPhase();

      // Calculate statistics
      this.calculateStats();

      // Store telemetry point EVERY SECOND for complete data
      this.storeTelemetry();

      // Update Discord Rich Presence via IPC
      if (this.discordEnabled) {
        try {
          const discordData = {
            flight: this.flight.flight || this.flight,
            route: this.flight.route || {},
            va: this.flight.va || {},
            phase: this.flightData.phase,
            currentState: this.currentState
          };
          
          // Log pour debug (première fois seulement)
          if (!this._discordLoggedOnce) {
            console.log('📡 Sending to Discord:', {
              flightNumber: discordData.route?.flight_number,
              departure: discordData.route?.departure_icao,
              arrival: discordData.route?.arrival_icao,
              va: discordData.va?.name,
              phase: discordData.phase,
              rawFlight: this.flight // Log l'objet complet pour debug
            });
            this._discordLoggedOnce = true;
          }
          
          ipcRenderer.invoke('discord-update', discordData).catch(err => {
            console.log('⚠️ Discord IPC update failed:', err.message);
          });
        } catch (error) {
          console.log('⚠️ Discord update error:', error.message);
        }
      }

      // Update UI callback
      if (this.onUpdate) {
        this.onUpdate({
          ...this.currentState,
          phase: this.flightData.phase,
          progress: this.getProgressPercentage(),
          duration: this.flightData.duration
        });
      }

    } catch (error) {
      console.error('Update error:', error);
    }
  }

  calculateProgress() {
    // Simple progress calculation based on altitude and on-ground status
    // In production, use actual GPS coordinates and calculate distance
    
    if (this.currentState.onGround && !this.hasStarted) {
      this.flightData.progress = 0;
    } else if (!this.currentState.onGround) {
      this.hasStarted = true;
      // Simulate progress based on time (replace with actual distance calculation)
      const elapsed = (new Date() - this.flightData.departureTime) / 1000 / 60; // minutes
      const estimatedDuration = 120; // Estimate, should come from route
      this.flightData.progress = Math.min(95, (elapsed / estimatedDuration) * 100);
    } else if (this.currentState.onGround && this.hasStarted) {
      this.flightData.progress = 100;
      this.hasLanded = true;
    }
  }

  getProgressPercentage() {
    return Math.round(this.flightData.progress || 0);
  }

  detectPhase() {
    const { onGround, altitude, verticalSpeed, groundSpeed } = this.currentState;
    const wasInAir = !this.lastState.onGround;

    // Detect touchdown moment: was in air, now on ground (only once!)
    if (wasInAir && onGround && this.hasStarted && !this.touchdownDetected) {
      // Capture landing rate at exact touchdown moment
      // Use lastState verticalSpeed (last moment in air before wheels touch)
      const touchdownVS = Math.abs(this.lastState.verticalSpeed);
      
      // Only capture if it's a realistic landing rate (not a glitch)
      if (touchdownVS > 0 && touchdownVS < 2000) {
        this.flightData.landingRate = touchdownVS;
        this.touchdownDetected = true; // Mark as captured
        console.log('🛬 TOUCHDOWN DETECTED! Landing Rate:', this.flightData.landingRate.toFixed(2), 'fpm');
        console.log('   Last VS in air:', this.lastState.verticalSpeed.toFixed(2));
        console.log('   Altitude at touchdown:', this.currentState.altitude.toFixed(2));
        console.log('   Ground speed:', this.currentState.groundSpeed.toFixed(2));
      }
    }

    if (onGround && groundSpeed < 5 && !this.hasStarted) {
      this.flightData.phase = 'Preflight';
    } else if (onGround && groundSpeed >= 5 && groundSpeed < 80) {
      this.flightData.phase = 'Taxi';
    } else if (!onGround && altitude < 10000 && verticalSpeed > 100) {
      this.flightData.phase = 'Takeoff';
    } else if (!onGround && altitude >= 10000 && verticalSpeed > 100) {
      this.flightData.phase = 'Climb';
    } else if (!onGround && altitude >= 10000 && Math.abs(verticalSpeed) < 500) {
      this.flightData.phase = 'Cruise';
    } else if (!onGround && verticalSpeed < -500) {
      this.flightData.phase = 'Descent';
    } else if (!onGround && altitude < 5000 && verticalSpeed < -100) {
      this.flightData.phase = 'Approach';
    } else if (onGround && this.hasStarted && groundSpeed > 30) {
      this.flightData.phase = 'Landing';
    } else if (onGround && this.hasStarted && groundSpeed < 30) {
      this.flightData.phase = 'Taxi to Gate';
    } else if (onGround && this.hasStarted && groundSpeed < 5) {
      this.flightData.phase = 'Arrived';
      if (!this.flightData.arrivalTime) {
        this.flightData.arrivalTime = new Date();
      }
    }
  }

  calculateStats() {
    // Duration
    if (this.flightData.departureTime) {
      const endTime = this.flightData.arrivalTime || new Date();
      this.flightData.duration = Math.floor((endTime - this.flightData.departureTime) / 1000 / 60);
    }

    // Distance (simplified - should use GPS coordinates)
    const timeDelta = 1; // seconds
    const distanceDelta = (this.currentState.groundSpeed * 0.514444 * timeDelta) / 1000; // km
    this.flightData.distanceFlown += distanceDelta;

    // Fuel (simplified)
    if (this.lastState.fuel > 0 && this.currentState.fuel > 0) {
      this.flightData.fuelUsed += (this.lastState.fuel - this.currentState.fuel);
    }

    // Max altitude
    if (this.currentState.altitude > this.flightData.maxAltitude) {
      this.flightData.maxAltitude = this.currentState.altitude;
    }

    // Max speed
    if (this.currentState.groundSpeed > this.flightData.maxSpeed) {
      this.flightData.maxSpeed = this.currentState.groundSpeed;
    }

    this.lastState = { ...this.currentState };
  }

  storeTelemetry() {
    // Only store valid telemetry points
    const { latitude, longitude, altitude } = this.currentState;
    
    // Skip invalid coordinates (0,0 or NaN means SimConnect not ready yet)
    if (!latitude || !longitude || latitude === 0 || longitude === 0 || 
        isNaN(latitude) || isNaN(longitude)) {
      return;
    }

    // Validate coordinates are in reasonable range
    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      console.warn('⚠️ Invalid coordinates detected:', { latitude, longitude });
      return;
    }

    const isFirstPoint = this.flightData.telemetry.length === 0;

    // Store telemetry point (EVERY SECOND for complete tracking)
    this.flightData.telemetry.push({
      timestamp: new Date().toISOString(),
      latitude: parseFloat(latitude.toFixed(6)),
      longitude: parseFloat(longitude.toFixed(6)),
      altitude: Math.round(altitude),
      groundSpeed: Math.round(this.currentState.groundSpeed),
      heading: Math.round(this.currentState.heading),
      verticalSpeed: Math.round(this.currentState.verticalSpeed),
      fuel: parseFloat(this.currentState.fuel.toFixed(1)),
      onGround: this.currentState.onGround,
      phase: this.flightData.phase
    });

    if (isFirstPoint) {
      console.log('✅ First telemetry point captured:', { 
        latitude: latitude.toFixed(6), 
        longitude: longitude.toFixed(6), 
        altitude: Math.round(altitude),
        phase: this.flightData.phase
      });
    }
  }

  async sendTelemetry() {
    if (!this.isTracking) return;

    try {
      // Send telemetry to server
      await APIService.sendTelemetry(this.flight.id, {
        current_state: this.currentState,
        phase: this.flightData.phase,
        progress: this.getProgressPercentage(),
        timestamp: new Date().toISOString()
      }, this.token);
    } catch (error) {
      console.error('Error sending telemetry:', error);
    }
  }

  getFlightData() {
    // Format dates to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
    const formatDateTime = (date) => {
      if (!date) return null;
      const d = new Date(date);
      return d.toISOString().slice(0, 19).replace('T', ' ');
    };

    // Capture current time as arrival time
    const arrivalTime = new Date();

    // Force capture last telemetry point if valid
    if (this.currentState.latitude && this.currentState.longitude &&
        this.currentState.latitude !== 0 && this.currentState.longitude !== 0) {
      
      // Check if we need to add final point
      const lastPoint = this.flightData.telemetry[this.flightData.telemetry.length - 1];
      const needsLastPoint = !lastPoint || 
        lastPoint.latitude !== this.currentState.latitude ||
        lastPoint.longitude !== this.currentState.longitude;
      
      if (needsLastPoint) {
        this.flightData.telemetry.push({
          timestamp: new Date().toISOString(),
          latitude: this.currentState.latitude,
          longitude: this.currentState.longitude,
          altitude: this.currentState.altitude,
          groundSpeed: this.currentState.groundSpeed,
          heading: this.currentState.heading,
          verticalSpeed: this.currentState.verticalSpeed,
          fuel: this.currentState.fuel,
          phase: 'Arrived'
        });
      }
    }

    const reportData = {
      actual_departure_time: formatDateTime(this.flightData.departureTime),
      actual_arrival_time: formatDateTime(arrivalTime),
      flight_duration: this.flightData.duration || 0,
      distance_flown: parseFloat(this.flightData.distanceFlown.toFixed(2)),
      fuel_used: parseFloat(this.flightData.fuelUsed.toFixed(2)),
      landing_rate: Math.abs(parseFloat(this.flightData.landingRate.toFixed(2))),
      telemetry_data: {
        max_altitude: this.flightData.maxAltitude || 0,
        max_speed: this.flightData.maxSpeed || 0,
        telemetry_points: this.flightData.telemetry // ALL telemetry points (every second)
      }
    };

    console.log('\n========================================');
    console.log('📊 FLIGHT REPORT SUMMARY');
    console.log('========================================');
    console.log('Departure:', reportData.actual_departure_time);
    console.log('Arrival:', reportData.actual_arrival_time);
    console.log('Duration:', reportData.flight_duration, 'minutes');
    console.log('Distance:', reportData.distance_flown, 'NM');
    console.log('Fuel Used:', reportData.fuel_used, 'kg/lbs');
    console.log('Landing Rate:', reportData.landing_rate, 'fpm', this.touchdownDetected ? '✅' : '❌ NOT DETECTED');
    console.log('Max Altitude:', reportData.telemetry_data.max_altitude, 'ft');
    console.log('Max Speed:', reportData.telemetry_data.max_speed, 'kts');
    console.log('Telemetry Points:', reportData.telemetry_data.telemetry_points.length, '(1 per second)');
    console.log('First Point:', reportData.telemetry_data.telemetry_points[0]);
    console.log('Last Point:', reportData.telemetry_data.telemetry_points[reportData.telemetry_data.telemetry_points.length - 1]);
    console.log('========================================\n');
    
    return reportData;
  }
}

// Base Simulator Connector
class SimulatorConnector {
  async connect() {
    throw new Error('connect() must be implemented');
  }

  async disconnect() {
    throw new Error('disconnect() must be implemented');
  }

  async getData() {
    throw new Error('getData() must be implemented');
  }
}

// MSFS Connector (SimConnect via IPC)
class MSFSConnector extends SimulatorConnector {
  constructor() {
    super();
    this.simconnect = null;
    this.connected = false;
  }

  async connect() {
    try {
      // Use IPC client to connect via main process
      // Need to use absolute path since we're loaded from HTML context
      const { ipcRenderer } = require('electron');
      
      // Direct IPC connection without separate module
      console.log('🔌 [Renderer] Requesting SimConnect connection...');
      const result = await ipcRenderer.invoke('simconnect:connect');
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to connect to SimConnect');
      }
      
      this.connected = true;
      this.ipcRenderer = ipcRenderer;
      console.log('✅ Successfully connected to MSFS via SimConnect');
    } catch (error) {
      console.error('❌ Failed to connect to MSFS:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.connected && this.ipcRenderer) {
      try {
        await this.ipcRenderer.invoke('simconnect:disconnect');
      } catch (error) {
        console.warn('Error disconnecting SimConnect:', error);
      }
      this.ipcRenderer = null;
    }
    this.connected = false;
  }

  async getData() {
    if (!this.connected || !this.ipcRenderer) {
      throw new Error('Not connected to MSFS');
    }

    try {
      const result = await this.ipcRenderer.invoke('simconnect:getData');
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to get data');
      }
      
      // Return the data in the expected format
      return {
        latitude: result.data.latitude,
        longitude: result.data.longitude,
        altitude: result.data.indicatedAltitude,
        groundSpeed: result.data.groundSpeed,
        heading: result.data.heading,
        verticalSpeed: result.data.verticalSpeed,
        onGround: result.data.onGround,
        fuel: result.data.fuel
      };
    } catch (error) {
      console.error('❌ Error getting MSFS data:', error);
      return {
        latitude: 0,
        longitude: 0,
        altitude: 0,
        groundSpeed: 0,
        heading: 0,
        verticalSpeed: 0,
        onGround: true,
        fuel: 0
      };
    }
  }
}

// X-Plane Connector (UDP)
class XPlaneConnector extends SimulatorConnector {
  constructor() {
    super();
    this.connected = false;
  }

  async connect() {
    // TODO: Implement X-Plane UDP connection
    throw new Error('X-Plane UDP not available');
  }

  async disconnect() {
    this.connected = false;
  }

  async getData() {
    // TODO: Parse UDP data from X-Plane
    return {
      latitude: 0,
      longitude: 0,
      altitude: 0,
      groundSpeed: 0,
      heading: 0,
      verticalSpeed: 0,
      onGround: true,
      fuel: 100
    };
  }
}

// P3D Connector (SimConnect)
class P3DConnector extends SimulatorConnector {
  constructor() {
    super();
    this.connected = false;
  }

  async connect() {
    // TODO: Implement P3D SimConnect connection
    throw new Error('P3D SimConnect not available');
  }

  async disconnect() {
    this.connected = false;
  }

  async getData() {
    // TODO: Request data from SimConnect
    return {
      latitude: 0,
      longitude: 0,
      altitude: 0,
      groundSpeed: 0,
      heading: 0,
      verticalSpeed: 0,
      onGround: true,
      fuel: 100
    };
  }
}

// Note: Simulation mode has been removed
// The tracker now requires a real simulator (MSFS, X-Plane, or P3D) to be running

