// API Configuration
const API_BASE_URL = 'https://flynova-backend-developpmeny.up.railway.app/api/acars'; // Routes ACARS - Development

// API Service
class APIService {
  static async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async getActiveReservation(userId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/flights/active/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reservation');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch reservation error:', error);
      throw error;
    }
  }

  static async cancelFlight(flightId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/flights/${flightId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel flight');
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel flight error:', error);
      throw error;
    }
  }

  static async submitFlightReport(flightId, reportData, token) {
    try {
      const payload = {
        flight_id: flightId,
        ...reportData
      };

      console.log('📤 Sending flight report:', payload);

      const response = await fetch(`${API_BASE_URL}/flight-reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`Failed to submit flight report: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Flight report submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Submit report error:', error);
      throw error;
    }
  }

  static async updateFlightStatus(flightId, status, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/flights/${flightId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update flight status');
      }

      return await response.json();
    } catch (error) {
      console.error('Update flight status error:', error);
      throw error;
    }
  }

  static async sendTelemetry(flightId, telemetryData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/flights/${flightId}/telemetry`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(telemetryData)
      });

      if (!response.ok) {
        console.error('Failed to send telemetry');
      }

      return await response.json();
    } catch (error) {
      console.error('Send telemetry error:', error);
      // Don't throw - telemetry is non-critical
    }
  }
}

// Storage Service
class StorageService {
  static saveAuth(userId, token, username) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  }

  static getAuth() {
    return {
      userId: localStorage.getItem('userId'),
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username')
    };
  }

  static clearAuth() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  static isAuthenticated() {
    const { userId, token } = this.getAuth();
    return !!(userId && token);
  }
}
