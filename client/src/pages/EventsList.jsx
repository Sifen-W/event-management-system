import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './EventsList.css'

function EventsList({ isOrganizer }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

const [error, setError] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3001/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

    if (loading) return <p className="status-text">Loading events...</p>
    if (error) return <p className="status-text error-text">Couldn't connect to the server. Make sure the backend is running.</p>
    if (events.length === 0) {
    return (
      <div className="empty-state">
        <h2>No events yet</h2>
        <p>{isOrganizer ? 'Create your first event to get started.' : 'Check back soon.'}</p>
        {isOrganizer && <Link to="/events/new" className="btn-create">+ Create Event</Link>}
      </div>
    )
  }

  return (
      <div>
        <div className="list-header">
          <h1 className="page-title">{isOrganizer ? 'Manage Events' : 'Upcoming Events'}</h1>
          {isOrganizer && <Link to="/events/new" className="btn-create">+ Create Event</Link>}
        </div>

<div className="filter-row">
        <input
          type="text"
          className="search-bar"
          placeholder="Search events by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="category-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="All">All categories</option>
          {[...new Set(events.map(e => e.category).filter(Boolean))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

        <div className="events-grid">
        {events
          .filter(event => event.title.toLowerCase().includes(search.toLowerCase()))
          .filter(event => category === 'All' || event.category === category)
          .map(event => {
              const spotsLeft = event.capacity - event.attendee_count
              const isFull = spotsLeft <= 0
              const linkTo = isOrganizer ? `/organizer/events/${event.id}` : `/events/${event.id}`
              return (
                <Link to={linkTo} key={event.id} className="event-card">
                  {event.category && <span className="event-category">{event.category}</span>}
                  <h3>{event.title}</h3>
                  <p className="event-meta">{event.date} · {event.time}</p>
                  <p className="event-meta">{event.location}</p>
                  <p className={`event-spots ${isFull ? 'full' : ''}`}>
                    {isFull ? 'Event Full' : `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left`}
                  </p>
                </Link>
              )
            })}
        </div>

        {events
                .filter(event => event.title.toLowerCase().includes(search.toLowerCase()))
                .filter(event => category === 'All' || event.category === category)
                .length === 0 && (
                <p className="status-text">No events match your search.</p>
              )}
      </div>
    )
  }

  export default EventsList