import React, { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [album, setAlbum] = useState('General');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    client.get('/gallery').then((res) => setImages(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', text: 'Please choose an image file.' });
      return;
    }
    setStatus(null);
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', caption);
      formData.append('album', album);

      await client.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setStatus({ type: 'success', text: 'Image added.' });
      setFile(null);
      setPreview(null);
      setCaption('');
      setAlbum('General');
      load();
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not add image.' });
    } finally {
      setSubmitting(false);
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
          Upload an image file directly from your computer.
        </p>
        {status && (
          <div className={`status-message ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
            {status.text}
          </div>
        )}
        <div className="form-field">
          <label>Image File</label>
          <input type="file" accept="image/*" onChange={onFileChange} required />
        </div>
        {preview && (
          <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
        )}
        <div className="form-field">
          <label>Caption (optional)</label>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Album</label>
          <input value={album} onChange={(e) => setAlbum(e.target.value)} placeholder="e.g. Fiesta 2026" />
        </div>
        <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Uploading…' : 'Add to Gallery'}
        </button>
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