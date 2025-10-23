// EXEMPLE D'ENDPOINTS API À AJOUTER AU BACKEND FLYNOVA
// Ces routes doivent être ajoutées à votre serveur Express existant

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

// Configuration de la base de données
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'flynova',
  port: 3306
};

const JWT_SECRET = process.env.JWT_SECRET || 'lc2tTBy*EQDhpGH2bduc!kkL@#5EXtCCevNaGiH2Xf0W1K9u8T#CcV#JFAasZv2@';

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// ============================================
// AUTHENTICATION ROUTES
// ============================================

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Find user by username or email
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username, username]
    );

    if (users.length === 0) {
      await connection.end();
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      await connection.end();
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      await connection.end();
      return res.status(403).json({
        success: false,
        message: 'Compte inactif ou suspendu'
      });
    }

    // Update last login
    await connection.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    await connection.end();

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
});

// ============================================
// FLIGHT ROUTES
// ============================================

/**
 * GET /api/flights/active/:userId
 * Get active flight reservation for a user
 */
router.get('/flights/active/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  // Verify user is requesting their own data
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({
      success: false,
      message: 'Accès non autorisé'
    });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Get active flight with route, VA, and fleet info
    const [flights] = await connection.execute(`
      SELECT 
        f.*,
        r.flight_number, r.route_type, r.departure_icao, r.departure_name,
        r.arrival_icao, r.arrival_name, r.aircraft_type,
        va.name as va_name, va.callsign, va.logo_url, va.primary_color,
        va.secondary_color, va.accent_color, va.text_on_primary,
        fleet.registration, fleet.aircraft_name
      FROM flights f
      INNER JOIN va_routes r ON f.route_id = r.id
      INNER JOIN virtual_airlines va ON f.va_id = va.id
      LEFT JOIN va_fleet fleet ON f.fleet_id = fleet.id
      WHERE f.user_id = ? 
        AND f.status IN ('reserved', 'in_progress')
      ORDER BY f.reserved_at DESC
      LIMIT 1
    `, [userId]);

    await connection.end();

    if (flights.length === 0) {
      return res.json({
        success: true,
        flight: null
      });
    }

    const flight = flights[0];

    res.json({
      success: true,
      flight: {
        id: flight.id,
        status: flight.status,
        reserved_at: flight.reserved_at,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time
      },
      route: {
        flight_number: flight.flight_number,
        route_type: flight.route_type,
        departure_icao: flight.departure_icao,
        departure_name: flight.departure_name,
        arrival_icao: flight.arrival_icao,
        arrival_name: flight.arrival_name,
        aircraft_type: flight.aircraft_type
      },
      va: {
        name: flight.va_name,
        callsign: flight.callsign,
        logo_url: flight.logo_url,
        primary_color: flight.primary_color,
        secondary_color: flight.secondary_color,
        accent_color: flight.accent_color,
        text_on_primary: flight.text_on_primary
      },
      fleet: flight.registration ? {
        registration: flight.registration,
        aircraft_name: flight.aircraft_name
      } : null
    });

  } catch (error) {
    console.error('Get active flight error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du vol'
    });
  }
});

/**
 * PATCH /api/flights/:flightId/status
 * Update flight status
 */
router.patch('/flights/:flightId/status', authenticateToken, async (req, res) => {
  const { flightId } = req.params;
  const { status } = req.body;

  const validStatuses = ['reserved', 'in_progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Statut invalide'
    });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Verify flight belongs to user
    const [flights] = await connection.execute(
      'SELECT * FROM flights WHERE id = ? AND user_id = ?',
      [flightId, req.user.id]
    );

    if (flights.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Vol non trouvé'
      });
    }

    // Update status
    const updateData = { status };
    
    if (status === 'in_progress' && !flights[0].departure_time) {
      updateData.departure_time = new Date();
    }

    const updateFields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const updateValues = [...Object.values(updateData), flightId];

    await connection.execute(
      `UPDATE flights SET ${updateFields} WHERE id = ?`,
      updateValues
    );

    await connection.end();

    res.json({
      success: true,
      message: 'Statut mis à jour'
    });

  } catch (error) {
    console.error('Update flight status error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
});

/**
 * DELETE /api/flights/:flightId
 * Cancel flight and delete reservation
 */
router.delete('/flights/:flightId', authenticateToken, async (req, res) => {
  const { flightId } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Verify flight belongs to user
    const [flights] = await connection.execute(
      'SELECT * FROM flights WHERE id = ? AND user_id = ?',
      [flightId, req.user.id]
    );

    if (flights.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Vol non trouvé'
      });
    }

    // Delete flight (will cascade to reports if any)
    await connection.execute('DELETE FROM flights WHERE id = ?', [flightId]);

    await connection.end();

    res.json({
      success: true,
      message: 'Vol annulé et réservation supprimée'
    });

  } catch (error) {
    console.error('Cancel flight error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation du vol'
    });
  }
});

/**
 * POST /api/flights/:flightId/telemetry
 * Send telemetry data during flight (optional)
 */
router.post('/flights/:flightId/telemetry', authenticateToken, async (req, res) => {
  const { flightId } = req.params;
  const telemetryData = req.body;

  try {
    // You can store this in a temporary table or just log it
    // For now, we'll just acknowledge receipt
    console.log(`Telemetry received for flight ${flightId}:`, telemetryData);

    res.json({
      success: true,
      message: 'Telemetry received'
    });

  } catch (error) {
    console.error('Telemetry error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la télémétrie'
    });
  }
});

// ============================================
// FLIGHT REPORT ROUTES
// ============================================

/**
 * POST /api/flight-reports
 * Submit flight report
 */
router.post('/flight-reports', authenticateToken, async (req, res) => {
  const {
    flight_id,
    actual_departure_time,
    actual_arrival_time,
    flight_duration,
    distance_flown,
    fuel_used,
    landing_rate,
    telemetry_data
  } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Verify flight belongs to user
    const [flights] = await connection.execute(
      'SELECT * FROM flights WHERE id = ? AND user_id = ?',
      [flight_id, req.user.id]
    );

    if (flights.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Vol non trouvé'
      });
    }

    // Calculate points based on landing rate and flight completion
    let points = 100; // Base points
    
    if (landing_rate && landing_rate < 600) {
      points += 50; // Bonus for smooth landing
    }
    if (flight_duration > 0) {
      points += Math.floor(flight_duration / 60) * 10; // Points per hour
    }

    // Insert flight report
    const [result] = await connection.execute(`
      INSERT INTO flight_reports (
        flight_id, actual_departure_time, actual_arrival_time,
        flight_duration, distance_flown, fuel_used, landing_rate,
        telemetry_data, points_awarded, validation_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      flight_id,
      actual_departure_time,
      actual_arrival_time,
      flight_duration,
      distance_flown,
      fuel_used,
      landing_rate,
      JSON.stringify(telemetry_data),
      points
    ]);

    // Update flight status
    await connection.execute(
      'UPDATE flights SET status = ?, arrival_time = ? WHERE id = ?',
      ['completed', actual_arrival_time, flight_id]
    );

    // Update VA member stats
    const flight = flights[0];
    await connection.execute(`
      UPDATE va_members 
      SET total_flights = total_flights + 1,
          total_hours = total_hours + ?,
          points = points + ?
      WHERE user_id = ? AND va_id = ?
    `, [flight_duration / 60, points, req.user.id, flight.va_id]);

    // Update fleet stats if applicable
    if (flight.fleet_id) {
      await connection.execute(`
        UPDATE va_fleet
        SET total_flights = total_flights + 1,
            total_hours = total_hours + ?
        WHERE id = ?
      `, [flight_duration / 60, flight.fleet_id]);
    }

    await connection.end();

    res.json({
      success: true,
      message: 'Rapport de vol soumis avec succès',
      report_id: result.insertId,
      points_awarded: points
    });

  } catch (error) {
    console.error('Submit flight report error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la soumission du rapport'
    });
  }
});

module.exports = router;
