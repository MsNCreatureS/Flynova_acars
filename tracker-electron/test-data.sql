-- ================================================
-- FLYNOVA ACARS - SQL DE TEST
-- ================================================
-- Ces requêtes permettent de créer des données de test
-- pour tester le tracker ACARS
-- ================================================

-- ================================================
-- 1. CRÉER UN UTILISATEUR DE TEST
-- ================================================

-- Générer un hash bcrypt pour le mot de passe "test123"
-- Utiliser un outil en ligne ou Node.js :
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('test123', 10);

INSERT INTO users (
    email, 
    username, 
    password_hash, 
    first_name, 
    last_name, 
    status
)
VALUES (
    'pilot@flynova.com',
    'testpilot',
    '$2b$10$rKvVJZt3qZqYZ5yZqYZ5ye', -- Remplacer par votre hash bcrypt
    'John',
    'Doe',
    'active'
);

-- Récupérer l'ID de l'utilisateur créé
SELECT id, username, email FROM users WHERE username = 'testpilot';
-- Notez l'ID (par exemple : 1)

-- ================================================
-- 2. CRÉER UNE VIRTUAL AIRLINE DE TEST
-- ================================================

INSERT INTO virtual_airlines (
    name,
    callsign,
    icao_code,
    iata_code,
    owner_id,  -- Utiliser l'ID de l'utilisateur créé ci-dessus
    logo_url,
    description,
    website,
    status,
    primary_color,
    secondary_color,
    accent_color,
    text_on_primary
)
VALUES (
    'FlyNova Airlines',
    'FLY',
    'FLY',
    'FN',
    1,  -- Remplacer par l'ID de l'utilisateur
    'http://localhost:3000/uploads/logos/flynova.png',  -- Adapter l'URL
    'Virtual Airline de démonstration pour tester le tracker ACARS',
    'https://flynova.com',
    'active',
    '#00c853',  -- Vert principal
    '#00a843',  -- Vert foncé
    '#00ff7f',  -- Vert clair
    '#ffffff'   -- Texte blanc
);

-- Récupérer l'ID de la VA créée
SELECT id, name, callsign FROM virtual_airlines WHERE callsign = 'FLY';
-- Notez l'ID (par exemple : 1)

-- ================================================
-- 3. AJOUTER LE PILOTE À LA VA
-- ================================================

INSERT INTO va_members (
    user_id,
    va_id,
    role,
    points,
    total_flights,
    total_hours,
    status
)
VALUES (
    1,  -- ID utilisateur
    1,  -- ID VA
    'Pilot',
    0,
    0,
    0.00,
    'active'
);

-- ================================================
-- 4. CRÉER DES AÉROPORTS (SI PAS DÉJÀ DANS LA BDD)
-- ================================================

INSERT INTO airports (name, city, country, iata_code, icao_code, latitude, longitude, altitude)
VALUES 
('Paris Charles de Gaulle', 'Paris', 'France', 'CDG', 'LFPG', 49.009691, 2.547925, 392),
('New York JFK', 'New York', 'United States', 'JFK', 'KJFK', 40.639751, -73.778925, 13);

-- ================================================
-- 5. CRÉER DES ROUTES
-- ================================================

INSERT INTO va_routes (
    va_id,
    flight_number,
    route_type,
    departure_icao,
    departure_name,
    arrival_icao,
    arrival_name,
    aircraft_type,
    status
)
VALUES 
-- Route transatlantique
(
    1,  -- ID VA
    'FLY001',
    'Civil',
    'LFPG',
    'Paris Charles de Gaulle',
    'KJFK',
    'New York JFK',
    'B777-300ER',
    'active'
),
-- Route européenne
(
    1,
    'FLY002',
    'Civil',
    'LFPG',
    'Paris Charles de Gaulle',
    'EGLL',
    'London Heathrow',
    'A320-200',
    'active'
),
-- Route cargo
(
    1,
    'FLY800',
    'Cargo',
    'LFPG',
    'Paris Charles de Gaulle',
    'EDDF',
    'Frankfurt',
    'B747-400F',
    'active'
);

-- Récupérer les IDs des routes créées
SELECT id, flight_number, departure_icao, arrival_icao 
FROM va_routes 
WHERE va_id = 1;

-- ================================================
-- 6. CRÉER UNE FLOTTE (OPTIONNEL)
-- ================================================

INSERT INTO va_fleet (
    va_id,
    registration,
    aircraft_type,
    aircraft_name,
    home_airport,
    status,
    total_flights,
    total_hours
)
VALUES 
(
    1,  -- ID VA
    'F-HFLY',
    'B777-300ER',
    'Spirit of FlyNova',
    'LFPG',
    'active',
    0,
    0.00
),
(
    1,
    'F-HNOV',
    'A320-200',
    'Sky Dancer',
    'LFPG',
    'active',
    0,
    0.00
);

-- Récupérer les IDs de la flotte
SELECT id, registration, aircraft_type 
FROM va_fleet 
WHERE va_id = 1;

-- ================================================
-- 7. CRÉER UNE RÉSERVATION DE VOL
-- ================================================

INSERT INTO flights (
    user_id,
    va_id,
    route_id,
    fleet_id,  -- Optionnel, mettre NULL si pas de flotte
    flight_number,
    status
)
VALUES (
    1,      -- ID utilisateur
    1,      -- ID VA
    1,      -- ID route (FLY001)
    1,      -- ID flotte (optionnel, mettre NULL si pas utilisé)
    'FLY001',
    'reserved'
);

-- Récupérer l'ID du vol créé
SELECT id, flight_number, status, reserved_at 
FROM flights 
WHERE user_id = 1 AND status = 'reserved';

-- ================================================
-- REQUÊTES DE VÉRIFICATION
-- ================================================

-- Vérifier qu'on a bien tout créé
SELECT 
    u.username,
    va.name as va_name,
    va.callsign,
    r.flight_number,
    r.departure_icao,
    r.arrival_icao,
    f.status,
    fleet.registration
FROM flights f
INNER JOIN users u ON f.user_id = u.id
INNER JOIN virtual_airlines va ON f.va_id = va.id
INNER JOIN va_routes r ON f.route_id = r.id
LEFT JOIN va_fleet fleet ON f.fleet_id = fleet.id
WHERE u.username = 'testpilot' AND f.status = 'reserved';

-- ================================================
-- REQUÊTES UTILES POUR LE DÉVELOPPEMENT
-- ================================================

-- Réinitialiser un vol (remettre en "reserved")
UPDATE flights 
SET status = 'reserved', departure_time = NULL, arrival_time = NULL 
WHERE id = 1;

-- Supprimer un rapport de vol
DELETE FROM flight_reports WHERE flight_id = 1;

-- Réinitialiser les stats d'un pilote
UPDATE va_members 
SET points = 0, total_flights = 0, total_hours = 0 
WHERE user_id = 1 AND va_id = 1;

-- Réinitialiser les stats de la flotte
UPDATE va_fleet 
SET total_flights = 0, total_hours = 0 
WHERE id = 1;

-- Voir tous les vols d'un utilisateur
SELECT 
    f.id,
    r.flight_number,
    r.departure_icao,
    r.arrival_icao,
    f.status,
    f.reserved_at,
    f.departure_time,
    f.arrival_time
FROM flights f
INNER JOIN va_routes r ON f.route_id = r.id
WHERE f.user_id = 1
ORDER BY f.reserved_at DESC;

-- Voir tous les rapports de vol d'un utilisateur
SELECT 
    fr.id,
    r.flight_number,
    fr.validation_status,
    fr.flight_duration,
    fr.distance_flown,
    fr.landing_rate,
    fr.points_awarded,
    fr.created_at
FROM flight_reports fr
INNER JOIN flights f ON fr.flight_id = f.id
INNER JOIN va_routes r ON f.route_id = r.id
WHERE f.user_id = 1
ORDER BY fr.created_at DESC;

-- Voir le classement des pilotes d'une VA
SELECT 
    u.username,
    vm.points,
    vm.total_flights,
    vm.total_hours,
    vm.role
FROM va_members vm
INNER JOIN users u ON vm.user_id = u.id
WHERE vm.va_id = 1 AND vm.status = 'active'
ORDER BY vm.points DESC;

-- ================================================
-- NETTOYAGE (À utiliser avec précaution !)
-- ================================================

-- Supprimer toutes les données de test
-- ATTENTION : Cela supprimera toutes les données !

-- DELETE FROM flight_reports WHERE flight_id IN (SELECT id FROM flights WHERE user_id = 1);
-- DELETE FROM flights WHERE user_id = 1;
-- DELETE FROM va_members WHERE user_id = 1;
-- DELETE FROM va_fleet WHERE va_id = 1;
-- DELETE FROM va_routes WHERE va_id = 1;
-- DELETE FROM virtual_airlines WHERE id = 1;
-- DELETE FROM users WHERE id = 1;
