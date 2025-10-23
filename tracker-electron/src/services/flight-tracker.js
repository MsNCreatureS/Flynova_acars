// Flight Tracker Service
// Supports MSFS, X-Plane, and P3D

class FlightTracker {
  constructor(flight, token) {
    this.flight = flight;
    this.token = token;
    this.isTracking = false;
    this.updateInterval = null;
    this.telemetryInterval = null;
    this.simulator = null;
    
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
      fuel: 0
    };

    this.lastState = { ...this.currentState };
    this.hasStarted = false;
    this.hasLanded = false;

    this.onUpdate = null;
  }

  async start() {
    console.log('Starting flight tracker...');
    this.isTracking = true;

    // Detect simulator
    await this.detectSimulator();

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

    // Fallback to simulation mode for testing
    console.warn('No simulator detected, using simulation mode');
    this.simulator = new SimulationConnector();
    await this.simulator.connect();
  }

  async update() {
    if (!this.isTracking || !this.simulator) return;

    try {
      // Get current flight data from simulator
      const data = await this.simulator.getData();
      
      // Update current state
      this.currentState = { ...data };

      // Calculate flight progress
      this.calculateProgress();

      // Detect flight phases
      this.detectPhase();

      // Calculate statistics
      this.calculateStats();

      // Store telemetry point
      this.storeTelemetry();

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
      // Capture landing rate
      if (this.lastState.verticalSpeed < 0) {
        this.flightData.landingRate = Math.abs(this.lastState.verticalSpeed);
      }
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
    // Store telemetry point (limit to avoid memory issues)
    if (this.flightData.telemetry.length < 10000) {
      this.flightData.telemetry.push({
        timestamp: new Date().toISOString(),
        ...this.currentState,
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
    return {
      actual_departure_time: this.flightData.departureTime,
      actual_arrival_time: this.flightData.arrivalTime,
      flight_duration: this.flightData.duration,
      distance_flown: this.flightData.distanceFlown.toFixed(2),
      fuel_used: this.flightData.fuelUsed.toFixed(2),
      landing_rate: this.flightData.landingRate.toFixed(2),
      telemetry_data: {
        max_altitude: this.flightData.maxAltitude,
        max_speed: this.flightData.maxSpeed,
        telemetry_points: this.flightData.telemetry.slice(0, 1000) // Limit size
      }
    };
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

// MSFS Connector (SimConnect)
class MSFSConnector extends SimulatorConnector {
  constructor() {
    super();
    this.connected = false;
  }

  async connect() {
    // TODO: Implement SimConnect connection
    // This requires native module or WebSocket bridge
    throw new Error('MSFS SimConnect not available');
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

// Simulation Mode Connector (for testing without simulator)
class SimulationConnector extends SimulatorConnector {
  constructor() {
    super();
    this.connected = false;
    this.simulationTime = 0;
    this.totalFlightTime = 120 * 60; // 120 minutes in seconds
  }

  async connect() {
    this.connected = true;
    console.log('Simulation mode activated');
  }

  async disconnect() {
    this.connected = false;
  }

  async getData() {
    // Simulate a complete flight
    this.simulationTime += 1;
    const progress = Math.min(1, this.simulationTime / this.totalFlightTime);

    let altitude = 0;
    let verticalSpeed = 0;
    let groundSpeed = 0;
    let onGround = true;

    // Simulate flight phases
    if (progress < 0.05) {
      // Taxi
      groundSpeed = 20;
      onGround = true;
    } else if (progress < 0.15) {
      // Takeoff and climb
      altitude = (progress - 0.05) * 350000; // Up to 35000ft
      verticalSpeed = 2000;
      groundSpeed = 250 + (progress * 200);
      onGround = false;
    } else if (progress < 0.8) {
      // Cruise
      altitude = 35000;
      verticalSpeed = 0;
      groundSpeed = 450;
      onGround = false;
    } else if (progress < 0.95) {
      // Descent
      altitude = 35000 - ((progress - 0.8) * 233333); // Down from 35000ft
      verticalSpeed = -1500;
      groundSpeed = 300 - ((progress - 0.8) * 1000);
      onGround = false;
    } else {
      // Landing and taxi
      altitude = 0;
      verticalSpeed = 0;
      groundSpeed = Math.max(0, 50 - ((progress - 0.95) * 1000));
      onGround = true;
    }

    return {
      latitude: 48.8566 + (progress * 10), // Simulate movement
      longitude: 2.3522 + (progress * 10),
      altitude: Math.max(0, altitude),
      groundSpeed: Math.max(0, groundSpeed),
      heading: 270,
      verticalSpeed,
      onGround,
      fuel: 100 - (progress * 50)
    };
  }
}
