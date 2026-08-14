import React, { useEffect, useState } from 'react';
import client from '../../api/client';

const empty = { fullName: '', hometown: '', prefecture: '', occupation: '', photoUrl: '', showInDirectory: true };

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    client.get('/members?all=true').then((res) => setMembers(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      if (editingId) {
        await client.put(`/members/${editingId}`, form);
        setStatus({ type: 'success', text: 'Member updated.' });
      } else {
        await client.post('/members', form);
        setStatus({ type: 'success', text: 'Member added.' });
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not save member.' });
    }
  };

  const onEdit = (m) => {
    setEditingId(m._id);
    setForm({
      fullName: m.fullName,
      hometown: m.hometown || '',
      prefecture: m.prefecture || '',
      occupation: m.occupation || '',
      photoUrl: m.photoUrl || '',
      showInDirectory: m.showInDirectory
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Remove this member?')) return;
    await client.delete(`/members/${id}`);
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
        <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Member' : 'Add Member'}</h3>
        {status && (
          <div className={`status-message ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
            {status.text}
          </div>
        )}
        <div className="form-field">
          <label>Full Name</label>
          <input name="fullName" required value={form.fullName} onChange={onChange} />
        </div>
        <div className="form-field">
          <label>Hometown (Philippines)</label>
          <input name="hometown" value={form.hometown} onChange={onChange} />
        </div>
        <div className="form-field">
          <label>Prefecture (Japan)</label>
          <input name="prefecture" value={form.prefecture} onChange={onChange} />
        </div>
        <div className="form-field">
          <label>Occupation</label>
          <input name="occupation" value={form.occupation} onChange={onChange} />
        </div>
        <div className="form-field">
          <label>Photo URL (optional)</label>
          <input name="photoUrl" value={form.photoUrl} onChange={onChange} placeholder="https://…" />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 14 }}>
          <input type="checkbox" name="showInDirectory" checked={form.showInDirectory} onChange={onChange} />
          Show in public directory
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" type="submit">{editingId ? 'Save Changes' : 'Add Member'}</button>
          {editingId && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
        </div>
      </form>

      <div>
        <h3>All Members {loading ? '' : `(${members.length})`}</h3>
        {loading && <p>Loading…</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {members.map((m) => (
            <div key={m._id} className="card" style={styles.row}>
              <div>
                <strong>{m.fullName}</strong>{' '}
                {!m.showInDirectory && <span style={styles.hiddenTag}>Hidden</span>}
                <p style={styles.meta}>{[m.occupation, m.prefecture].filter(Boolean).join(' · ')}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => onEdit(m)}>Edit</button>
                <button className="btn btn-danger" onClick={() => onDelete(m._id)}>Delete</button>
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
  meta: { margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' },
  hiddenTag: {
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    background: 'var(--color-paper-alt)',
    color: 'var(--color-text-muted)',
    padding: '2px 8px',
    borderRadius: 20
  }
};
