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
        <Link to="/events/new" className="btn-create">+ Create Event</Link>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<EventsList />} />
          <Route path="/events/new" element={<EventForm />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/edit" element={<EventForm />} />
        </Routes>
      </main>
    </div>
  )
}

export default App