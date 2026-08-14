import React, { useEffect, useState } from 'react';
import client from '../../api/client';

const empty = { title: '', description: '', date: '', location: '', category: 'other', imageUrl: '' };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    client.get('/events').then((res) => setEvents(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      if (editingId) {
        await client.put(`/events/${editingId}`, form);
        setStatus({ type: 'success', text: 'Event updated.' });
      } else {
        await client.post('/events', form);
        setStatus({ type: 'success', text: 'Event created.' });
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not save event.' });
    }
  };

  const onEdit = (ev) => {
    setEditingId(ev._id);
    setForm({
      title: ev.title,
      description: ev.description,
      date: ev.date ? ev.date.slice(0, 16) : '',
      location: ev.location,
      category: ev.category,
      imageUrl: ev.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await client.delete(`/events/${id}`);
    load();
  };

  const onCancel = () => {
    setEditingId(null);
    setForm(empty);
    setStatus(null);
  };

  return (
    <div style={styles.wrap}>
      <form className="card" style={styles.form} onSubmit={onSubmit}>
        <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Event' : 'New Event'}</h3>
        {status && (
          <div className={`status-message ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
            {status.text}
          </div>
        )}
        <div className="form-field">
          <label>Title</label>
          <input name="title" required value={form.title} onChange={onChange} />
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea name="description" rows={3} required value={form.description} onChange={onChange} />
        </div>
        <div className="form-field">
          <label>Date &amp; Time</label>
          <input type="datetime-local" name="date" required value={form.date} onChange={onChange} />
        </div>
        <div className="form-field">
          <label>Location</label>
          <input name="location" required value={form.location} onChange={onChange} />
        </div>
        <div className="form-field">
          <label>Category</label>
          <select name="category" value={form.category} onChange={onChange}>
            <option value="fiesta">Fiesta</option>
            <option value="religious">Religious</option>
            <option value="sports">Sports</option>
            <option value="meeting">Meeting</option>
            <option value="cultural">Cultural</option>
            <option value="livelihood">Livelihood</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-field">
          <label>Image URL (optional)</label>
          <input name="imageUrl" value={form.imageUrl} onChange={onChange} placeholder="https://…" />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" type="submit">{editingId ? 'Save Changes' : 'Create Event'}</button>
          {editingId && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
        </div>
      </form>

      <div>
        <h3>All Events {loading ? '' : `(${events.length})`}</h3>
        {loading && <p>Loading…</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {events.map((ev) => (
            <div key={ev._id} className="card" style={styles.row}>
              <div>
                <strong>{ev.title}</strong>
                <p style={styles.meta}>{new Date(ev.date).toLocaleString()} · {ev.location}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => onEdit(ev)}>Edit</button>
                <button className="btn btn-danger" onClick={() => onDelete(ev._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: 32, alignItems: 'flex-start' },
  form: { padding: 24, position: 'sticky', top: 96 },
  row: { padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  meta: { margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }
};
