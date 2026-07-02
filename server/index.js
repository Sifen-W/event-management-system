const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// --- EVENTS ---

// Get all events, with attendee count for each
app.get('/api/events', (req, res) => {
  const events = db.prepare(`
    SELECT events.*, 
      (SELECT COUNT(*) FROM attendees WHERE attendees.event_id = events.id) AS attendee_count
    FROM events
    ORDER BY date ASC
  `).all();
  res.json(events);
});

// Get one event by id, plus its attendees
app.get('/api/events/:id', (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const attendees = db.prepare('SELECT * FROM attendees WHERE event_id = ?').all(req.params.id);
  res.json({ ...event, attendees });
});

// Create a new event
app.post('/api/events', (req, res) => {
  const { title, description, date, time, location, category, capacity } = req.body;
  if (!title || !date || !time || !location || !capacity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const result = db.prepare(`
    INSERT INTO events (title, description, date, time, location, category, capacity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, description, date, time, location, category, capacity);

  res.status(201).json({ id: result.lastInsertRowid });
});

// Update an event
app.put('/api/events/:id', (req, res) => {
  const { title, description, date, time, location, category, capacity } = req.body;
  db.prepare(`
    UPDATE events SET title=?, description=?, date=?, time=?, location=?, category=?, capacity=?
    WHERE id=?
  `).run(title, description, date, time, location, category, capacity, req.params.id);

  res.json({ success: true });
});

// Delete an event
app.delete('/api/events/:id', (req, res) => {
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- RSVP ---

// Add an attendee to an event (with capacity check)
app.post('/api/events/:id/rsvp', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const count = db.prepare('SELECT COUNT(*) AS c FROM attendees WHERE event_id = ?').get(req.params.id).c;
  if (count >= event.capacity) {
    return res.status(400).json({ error: 'Event is full' });
  }

  db.prepare('INSERT INTO attendees (event_id, name, email) VALUES (?, ?, ?)').run(req.params.id, name, email);
  res.status(201).json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));