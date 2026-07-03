import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import EventsList from './pages/EventsList'
import EventDetail from './pages/EventDetail'
import EventForm from './pages/EventForm'
import Login from './pages/Login'
import './App.css'

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('token') || null)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  function handleLogin(newToken) {
    setToken(newToken)
    sessionStorage.setItem('token', newToken)
  }

  function handleLogout() {
    setToken(null)
    sessionStorage.removeItem('token')
  }

  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="logo">Event Manager</Link>
        <nav className="nav-links">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link to="/">Browse Events</Link>
          {token ? (
            <>
              <Link to="/organizer" className="btn-create">Organizer Dashboard</Link>
              <button className="link-btn" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <Link to="/login" className="btn-create">Organizer Login</Link>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<EventsList isOrganizer={false} />} />
          <Route path="/events/:id" element={<EventDetail isOrganizer={false} token={token} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          <Route path="/organizer" element={
            token ? <EventsList isOrganizer={true} /> : <Navigate to="/login" />
          } />
          <Route path="/organizer/events/:id" element={
            token ? <EventDetail isOrganizer={true} token={token} /> : <Navigate to="/login" />
          } />
          <Route path="/events/new" element={
            token ? <EventForm token={token} /> : <Navigate to="/login" />
          } />
          <Route path="/events/:id/edit" element={
            token ? <EventForm token={token} /> : <Navigate to="/login" />
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App