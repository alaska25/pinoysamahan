import React, { useEffect, useState } from 'react';
import client from '../../api/client';

const empty = { imageUrl: '', caption: '', album: 'General' };

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    client.get('/gallery').then((res) => setImages(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      await client.post('/gallery', form);
      setStatus({ type: 'success', text: 'Image added.' });
      setForm(empty);
      load();
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not add image.' });
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    await client.delete(`/gallery/${id}`);
    load();
  };

  return (
    <div style={styles.wrap}>
      <form className="card" style={styles.form} onSubmit={onSubmit}>
        <h3 style={{ marginTop: 0 }}>Add Photo</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: -8 }}>
          Paste an image URL (e.g. from Google Drive, Imgur, or your host). File upload isn't wired up yet.
        </p>
        {status && (
          <div className={`status-message ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
            {status.text}
          </div>
        )}
        <div className="form-field">
          <label>Image URL</label>
          <input name="imageUrl" required value={form.imageUrl} onChange={onChange} placeholder="https://…" />
        </div>
        <div className="form-field">
          <label>Caption (optional)</label>
          <input name="caption" value={form.caption} onChange={onChange} />
        </div>
        <div className="form-field">
          <label>Album</label>
          <input name="album" value={form.album} onChange={onChange} placeholder="e.g. Fiesta 2026" />
        </div>
        <button className="btn btn-primary" type="submit">Add to Gallery</button>
      </form>

      <div>
        <h3>All Photos {loading ? '' : `(${images.length})`}</h3>
        {loading && <p>Loading…</p>}
        <div style={styles.grid}>
          {images.map((img) => (
            <div key={img._id} className="card" style={styles.thumbCard}>
              <img src={img.imageUrl} alt={img.caption} style={styles.thumb} />
              <div style={{ padding: 10 }}>
                <p style={styles.caption}>{img.caption || img.album}</p>
                <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => onDelete(img._id)}>
                  Delete
                </button>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 },
  thumbCard: { overflow: 'hidden', padding: 0 },
  thumb: { width: '100%', height: 120, objectFit: 'cover' },
  caption: { fontSize: 13, margin: '0 0 8px', color: 'var(--color-text-muted)' }
};
