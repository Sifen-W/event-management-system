const requireAuth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all events, with attendee count for each
router.get('/', (req, res) => {
  const events = db.prepare(`
    SELECT events.*, 
      (SELECT COUNT(*) FROM attendees WHERE attendees.event_id = events.id) AS attendee_count
    FROM events
    ORDER BY date ASC
  `).all();
  res.json(events);
});

// Get one event by id, plus its attendees
router.get('/:id', (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const attendees = db.prepare('SELECT * FROM attendees WHERE event_id = ?').all(req.params.id);
  res.json({ ...event, attendees });
});

// Create a new event
router.post('/', requireAuth, (req, res) => {
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
router.put('/:id', requireAuth, (req, res) => {
  const { title, description, date, time, location, category, capacity } = req.body;
  db.prepare(`
    UPDATE events SET title=?, description=?, date=?, time=?, location=?, category=?, capacity=?
    WHERE id=?
  `).run(title, description, date, time, location, category, capacity, req.params.id);

  res.json({ success: true });
});

// Delete an event
router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Add an attendee to an event (with capacity check)
router.post('/:id/rsvp', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const existing = db.prepare('SELECT * FROM attendees WHERE event_id = ? AND email = ?').get(req.params.id, email);
  if (existing) {
    return res.status(400).json({ error: 'This email has already RSVP\'d to this event' });
  }

  const count = db.prepare('SELECT COUNT(*) AS c FROM attendees WHERE event_id = ?').get(req.params.id).c;
  if (count >= event.capacity) {
    return res.status(400).json({ error: 'Event is full' });
  }

  db.prepare('INSERT INTO attendees (event_id, name, email) VALUES (?, ?, ?)').run(req.params.id, name, email);
  res.status(201).json({ success: true });
});

module.exports = router;