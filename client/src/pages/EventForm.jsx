import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './EventForm.css'

function EventForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    capacity: ''
  })
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing) return
    fetch(`http://localhost:3001/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          title: data.title,
          description: data.description || '',
          date: data.date,
          time: data.time,
          location: data.location,
          category: data.category || '',
          capacity: data.capacity
        })
        setLoading(false)
      })
  }, [id, isEditing])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.title || !form.date || !form.time || !form.location || !form.capacity) {
      setError('Please fill in all required fields.')
      return
    }

    setSaving(true)
    const url = isEditing
      ? `http://localhost:3001/api/events/${id}`
      : 'http://localhost:3001/api/events'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, capacity: Number(form.capacity) })
      })
      if (!res.ok) throw new Error('Failed to save event')
      const data = await res.json()
      navigate(isEditing ? `/events/${id}` : `/events/${data.id}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  if (loading) return <p className="status-text">Loading event...</p>

  return (
    <div className="form-page">
      <h1 className="page-title">{isEditing ? 'Edit Event' : 'Create Event'}</h1>
      <form className="event-form" onSubmit={handleSubmit}>
        <label>
          Title *
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Intro to Python Workshop" />
        </label>

        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="What's this event about?" />
        </label>

        <div className="form-row">
          <label>
            Date *
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </label>
          <label>
            Time *
            <input type="time" name="time" value={form.time} onChange={handleChange} />
          </label>
        </div>

        <label>
          Location *
          <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Lab 3, Main Building" />
        </label>

        <div className="form-row">
          <label>
            Category
            <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Workshop" />
          </label>
          <label>
            Capacity *
            <input type="number" min="1" name="capacity" value={form.capacity} onChange={handleChange} placeholder="e.g. 30" />
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EventForm