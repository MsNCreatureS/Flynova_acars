# 🐛 Debug Flight Report Submission Error 500

## Error Description
When ending a flight, getting HTTP 500 error on `/api/acars/flight-reports`

## What to Check

### 1. Check Browser Console (F12)
Look for the exact payload being sent:
```
📤 Sending flight report: { ... }
```

### 2. Check Backend Logs
In your backend terminal, you should see the incoming request and any error messages.

### 3. Expected Payload Format

Based on `api-endpoints-example.js`, the backend expects:
```json
{
  "flight_id": 123,
  "actual_departure_time": "2025-10-23 18:30:00",
  "actual_arrival_time": "2025-10-23 20:45:00",
  "flight_duration": 135,
  "distance_flown": 450.25,
  "fuel_used": 2500.50,
  "landing_rate": 150.00,
  "telemetry_data": {
    "max_altitude": 35000,
    "max_speed": 480,
    "telemetry_points": [...]
  }
}
```

### 4. Common Issues

#### Issue 1: Date Format
- ❌ ISO format: `2025-10-23T18:30:00.000Z`
- ✅ MySQL format: `2025-10-23 18:30:00`

**Fixed in:** `flight-tracker.js` line 271 with `formatDateTime()`

#### Issue 2: telemetry_data Double Stringify
- Backend does `JSON.stringify(telemetry_data)`
- So we must send it as **object**, not string

**Fixed in:** `flight-tracker.js` line 284

#### Issue 3: Missing Fields
Backend requires:
- `flight_id` ✅
- `actual_departure_time` ✅  
- `actual_arrival_time` ✅
- `flight_duration` ✅
- `distance_flown` ✅
- `fuel_used` ✅
- `landing_rate` ✅
- `telemetry_data` ✅

#### Issue 4: NULL Values
If a flight never took off:
- `actual_departure_time` could be NULL
- `actual_arrival_time` could be NULL
- `flight_duration` could be 0

**Check in code:** `getFlightData()` returns proper defaults

### 5. How to Debug

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **End a flight**
4. **Look for:**
   ```
   📊 Flight report data: {...}
   📤 Sending flight report: {...}
   ❌ Server error response: ...
   ```

5. **Check Network tab:**
   - Find the POST request to `/api/acars/flight-reports`
   - Check **Request Payload**
   - Check **Response**

6. **Check Backend Terminal:**
   - Look for SQL errors
   - Look for missing fields errors
   - Look for date parsing errors

### 6. Backend Error Messages to Look For

```sql
-- Foreign key constraint failed
Cannot add or update a child row: a foreign key constraint fails

-- Date format error
Incorrect datetime value

-- JSON parsing error
Invalid JSON text

-- Missing field
Field 'xxx' doesn't have a default value
```

### 7. Quick Fix Test

Try manually in MySQL:
```sql
USE flynova;

INSERT INTO flight_reports (
  flight_id, 
  actual_departure_time, 
  actual_arrival_time,
  flight_duration, 
  distance_flown, 
  fuel_used, 
  landing_rate,
  telemetry_data, 
  points_awarded
) VALUES (
  1,  -- Replace with your flight_id
  '2025-10-23 18:30:00',
  '2025-10-23 20:45:00',
  135,
  450.25,
  2500.50,
  150.00,
  '{"max_altitude": 35000, "max_speed": 480}',
  100
);
```

If this fails, you know it's a database issue.
If it works, it's a data format issue from the tracker.

### 8. Check Backend Route Exists

In backend, verify:
```javascript
// backend/routes/acars.js or similar
router.post('/flight-reports', authenticateToken, async (req, res) => {
  // This route MUST exist
});
```

And in `server.js`:
```javascript
const acarsRoutes = require('./routes/acars');
app.use('/api/acars', acarsRoutes);
```

### 9. Verify Flight ID Exists

The flight must exist in the database:
```sql
SELECT * FROM flights WHERE id = 123;  -- Your flight ID
```

### 10. Check User Authentication

The JWT token must be valid and user must own the flight:
```sql
SELECT * FROM flights WHERE id = 123 AND user_id = 1;  -- Your user ID
```

---

## Testing Checklist

- [ ] Browser console shows correct payload format
- [ ] Dates are in `YYYY-MM-DD HH:MM:SS` format
- [ ] All required fields are present
- [ ] `telemetry_data` is an object (not stringified)
- [ ] Backend route `/api/acars/flight-reports` exists
- [ ] Backend logs show the incoming request
- [ ] Flight exists in database
- [ ] User owns the flight
- [ ] JWT token is valid
- [ ] MySQL connection is working

---

## Next Steps

After checking the console logs from the latest version:

1. **If you see the payload**, paste it here and we'll analyze it
2. **If you see backend error**, paste the error message
3. **If SQL error**, we'll fix the query or data format

The tracker now logs everything, so we'll see exactly what's being sent!
