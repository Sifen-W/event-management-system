import { Routes, Route, Link } from 'react-router-dom'
import EventsList from './pages/EventsList'
import EventDetail from './pages/EventDetail'
import EventForm from './pages/EventForm'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="logo">Event Manager</Link>
        <nav className="nav-links">
          <Link to="/">Browse Events</Link>
          <Link to="/organizer" className="btn-create">Organizer Dashboard</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<EventsList isOrganizer={false} />} />
          <Route path="/events/:id" element={<EventDetail isOrganizer={false} />} />

          <Route path="/organizer" element={<EventsList isOrganizer={true} />} />
          <Route path="/organizer/events/:id" element={<EventDetail isOrganizer={true} />} />
          <Route path="/events/new" element={<EventForm />} />
          <Route path="/events/:id/edit" element={<EventForm />} />
        </Routes>
      </main>
    </div>
  )
}

export default App