import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './EventsList.css'

function EventsList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="status-text">Loading events...</p>

  if (events.length === 0) {
    return (
      <div className="empty-state">
        <h2>No events yet</h2>
        <p>Create your first event to get started.</p>
        <Link to="/events/new" className="btn-create">+ Create Event</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Upcoming Events</h1>
      <div className="events-grid">
        {events.map(event => {
          const spotsLeft = event.capacity - event.attendee_count
          const isFull = spotsLeft <= 0
          return (
            <Link to={`/events/${event.id}`} key={event.id} className="event-card">
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
    </div>
  )
}

export default EventsList