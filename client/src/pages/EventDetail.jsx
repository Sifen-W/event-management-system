import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './EventDetail.css'

function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rsvpForm, setRsvpForm] = useState({ name: '', email: '' })
  const [rsvpError, setRsvpError] = useState('')
  const [rsvpSuccess, setRsvpSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function loadEvent() {
    fetch(`http://localhost:3001/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadEvent()
  }, [id])

  async function handleDelete() {
    if (!confirm('Delete this event? This cannot be undone.')) return
    await fetch(`http://localhost:3001/api/events/${id}`, { method: 'DELETE' })
    navigate('/')
  }

  async function handleRsvp(e) {
    e.preventDefault()
    setRsvpError('')

    if (!rsvpForm.name || !rsvpForm.email) {
      setRsvpError('Please enter your name and email.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`http://localhost:3001/api/events/${id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpForm)
      })
      const data = await res.json()
      if (!res.ok) {
        setRsvpError(data.error || 'Something went wrong.')
        setSubmitting(false)
        return
      }
      setRsvpForm({ name: '', email: '' })
      setRsvpSuccess(true)
      setSubmitting(false)
      loadEvent()
    } catch (err) {
      setRsvpError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) return <p className="status-text">Loading event...</p>
  if (!event) return <p className="status-text">Event not found.</p>

  const spotsLeft = event.capacity - event.attendees.length
  const isFull = spotsLeft <= 0

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">← Back to events</Link>

      <div className="detail-header">
        <div>
          {event.category && <span className="event-category">{event.category}</span>}
          <h1>{event.title}</h1>
          <p className="event-meta">{event.date} · {event.time}</p>
          <p className="event-meta">{event.location}</p>
        </div>
        <div className="detail-actions">
          <Link to={`/events/${id}/edit`} className="btn-secondary">Edit</Link>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {event.description && <p className="event-description">{event.description}</p>}

      <div className="detail-grid">
        <div className="rsvp-section">
          <h2>RSVP</h2>
          <p className={`spots-indicator ${isFull ? 'full' : ''}`}>
            {isFull ? 'This event is full' : `${spotsLeft} of ${event.capacity} spots left`}
          </p>

          {rsvpSuccess && <p className="rsvp-success">You're on the list! 🎉</p>}

          {!isFull && (
            <form className="rsvp-form" onSubmit={handleRsvp}>
              <input
                type="text"
                placeholder="Your name"
                value={rsvpForm.name}
                onChange={e => setRsvpForm({ ...rsvpForm, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Your email"
                value={rsvpForm.email}
                onChange={e => setRsvpForm({ ...rsvpForm, email: e.target.value })}
              />
              {rsvpError && <p className="form-error">{rsvpError}</p>}
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Reserving...' : 'Reserve my spot'}
              </button>
            </form>
          )}
        </div>

        <div className="attendees-section">
          <h2>Attendees ({event.attendees.length})</h2>
          {event.attendees.length === 0 ? (
            <p className="status-text">No one has RSVP'd yet.</p>
          ) : (
            <ul className="attendees-list">
              {event.attendees.map(a => (
                <li key={a.id}>
                  <span className="attendee-name">{a.name}</span>
                  <span className="attendee-email">{a.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetail