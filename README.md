# Event Management System

A full-stack web application for creating, managing, and RSVPing to events. Built as a scoped project focused on a clean, working end-to-end flow rather than breadth of features.

## Features

- **Organizer Authentication** — a password-protected login gates access to event management (JWT-based)
- **Organizer Dashboard** — create, edit, and delete events (requires login)
- **Public Event Browsing** — anyone can view upcoming events with live spot availability, no login required
- **Search & Category Filter** — find events by title or filter by category
- **RSVP System** — attendees reserve a spot with name and email; capacity is enforced server-side so events can't be overbooked, and duplicate RSVPs (same email, same event) are blocked
- **Attendee Tracking** — organizers can see who has RSVP'd to each event
- **Light / Dark Mode** — theme preference is remembered across visits
- **Responsive UI** — works across desktop and mobile screen sizes
- **Graceful error handling** — missing events and backend connection issues show clear messages instead of crashing

## Tech Stack

- **Frontend:** React (Vite), React Router
- **Backend:** Express.js
- **Database:** SQLite (via `better-sqlite3`)
- **Auth:** JWT (`jsonwebtoken`) + password hashing (`bcrypt`)

## Project Structure

```
event-management-system/
├── server/
│   ├── db.js               # Database connection and schema
│   ├── index.js             # Express app entry point
│   ├── seed.js               # Script to populate sample events
│   ├── .env                  # Secrets (not committed — see setup below)
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js           # Login endpoint
│   │   └── events.js         # Event and RSVP API routes
│   └── package.json
└── client/
    ├── src/
    │   ├── pages/
    │   │   ├── EventsList.jsx    # Browse (public) / manage (organizer) events
    │   │   ├── EventDetail.jsx   # Event details, RSVP, attendees
    │   │   ├── EventForm.jsx     # Create / edit event form (organizer only)
    │   │   └── Login.jsx         # Organizer login
    │   ├── App.jsx                # Routing, auth state, theme, route protection
    │   └── main.jsx
    └── package.json
```

## Design Decisions

- **Single shared organizer login, not per-user accounts:** Scoped this way to keep the project focused within the timeline. There's one organizer password (hashed with `bcrypt`), and logging in issues a JWT that's required to create, edit, or delete events. Browsing and RSVPing remain fully public, matching how most real event platforms treat attendees vs. organizers. Multi-organizer accounts (each managing their own events) would be the natural next step.
- **Token storage in `sessionStorage`:** The login token clears when the browser tab closes, rather than persisting indefinitely — a reasonable default for a single shared organizer credential.
- **SQLite over a client-server database:** Zero-config and file-based, well suited to this project's scale. Since all queries use parameterized SQL, migrating to PostgreSQL or MySQL later would require minimal changes.

## Running Locally

**1. Backend setup:**
```bash
cd server
npm install
```

Create a `.env` file inside `server/` with:
```
JWT_SECRET=your-own-long-random-string
ORGANIZER_PASSWORD_HASH=
```

Generate a password hash for the organizer login. For a quick review, you can use the demo password `demo1234`:
```bash
node -e "require('bcrypt').hash(process.argv[1], 10).then(console.log)" "demo1234"
```
Copy the printed hash into `ORGANIZER_PASSWORD_HASH` in `.env`.

Then log in at `/login` using the password `demo1234` to access the Organizer Dashboard.

(To use your own password instead of the demo one, just replace `demo1234` in the command above with your chosen password.)

(Optional) Seed some sample events:
```bash
node seed.js
```

Start the backend:
```bash
node index.js
```
Runs on `http://localhost:3001`

**2. Frontend setup:**
```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`

Both servers need to be running simultaneously for the app to work.

## Demo Access

For quick review without generating your own hash, use:
- **Organizer password:** `demo1234`

(This is a demo-only credential documented for reviewer convenience — not intended to guard anything sensitive.)

## API Endpoints

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Log in with organizer password, returns a JWT |
| GET | `/api/events` | No | List all events with attendee counts |
| GET | `/api/events/:id` | No | Get one event with its attendee list |
| POST | `/api/events` | Yes | Create a new event |
| PUT | `/api/events/:id` | Yes | Update an event |
| DELETE | `/api/events/:id` | Yes | Delete an event |
| POST | `/api/events/:id/rsvp` | No | RSVP to an event (capacity-enforced, one RSVP per email) |

Protected routes require an `Authorization: Bearer <token>` header, obtained from `/api/auth/login`.