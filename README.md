# Event Management System

A full-stack web application for creating, managing, and RSVPing to events. Built as a scoped project focused on a clean, working end-to-end flow rather than breadth of features.

## Features

- **Organizer Dashboard** — create, edit, and delete events
- **Public Event Browsing** — view upcoming events with live spot availability
- **RSVP System** — attendees reserve a spot with name and email; capacity is enforced server-side so events can't be overbooked
- **Attendee Tracking** — organizers can see who has RSVP'd to each event
- **Responsive UI** — works across desktop and mobile screen sizes

## Tech Stack

- **Frontend:** React (Vite), React Router
- **Backend:** Express.js
- **Database:** SQLite (via `better-sqlite3`)

## Project Structure

```
event-management-system/
├── server/
│   ├── db.js              # Database connection and schema
│   ├── index.js           # Express app entry point
│   ├── routes/
│   │   └── events.js      # Event and RSVP API routes
│   └── package.json
└── client/
    ├── src/
    │   ├── pages/
    │   │   ├── EventsList.jsx    # Browse / manage events
    │   │   ├── EventDetail.jsx   # Event details, RSVP, attendees
    │   │   └── EventForm.jsx     # Create / edit event form
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Design Decisions

- **No authentication:** Scoped out to prioritize a complete core feature set within the project timeline. The app uses a public/organizer route split (`/` vs `/organizer`) to approximate the real-world separation between attendees and event managers, without the overhead of building a full auth system. Adding real accounts (organizer login, attendee identity) would be the natural next step.
- **SQLite over a client-server database:** Zero-config and file-based, well suited to this project's scale. Since all queries use parameterized SQL, migrating to PostgreSQL or MySQL later would require minimal changes.

## Running Locally

**Backend:**
```bash
cd server
npm install
node index.js
```
Runs on `http://localhost:3001`

**Frontend:**
```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`

Both servers need to be running simultaneously for the app to work.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | List all events with attendee counts |
| GET | `/api/events/:id` | Get one event with its attendee list |
| POST | `/api/events` | Create a new event |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |
| POST | `/api/events/:id/rsvp` | RSVP to an event (capacity-enforced) |