import React, { useState } from 'react';
import client from '../api/client';
import Sunburst from '../components/Sunburst';

const initial = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await client.post('/contact', { ...form, type: 'contact' });
      setStatus({ type: 'success', text: 'Salamat sa iyong mensahe! Sasagutin namin ito sa lalong madaling panahon.' });
      setForm(initial);
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'May problema, subukan ulit.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container" style={styles.wrap}>
        <div style={styles.intro}>
          <span className="eyebrow"><Sunburst size={14} /> Kontak</span>
          <h1>Makipag-ugnayan sa Amin</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            May tanong tungkol sa samahan, gusto mo bang mag-volunteer, o may
            kailangan kang tulong? Sulatan mo lang kami.
          </p>
          <div style={styles.infoCard} className="card">
            <p style={styles.infoLine}><strong>Email:</strong> info@pinoysajapan.org</p>
            <p style={styles.infoLine}><strong>Facebook:</strong> /SamahanNgPinoyJapan</p>
            <p style={styles.infoLine}><strong>Base:</strong> Tokyo, Japan (with chapters nationwide)</p>
          </div>
        </div>

        <form className="card" style={styles.form} onSubmit={onSubmit}>
          {status && (
            <div className={`status-message ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
              {status.text}
            </div>
          )}
          <div className="form-field">
            <label htmlFor="name">Pangalan</label>
            <input id="name" name="name" required value={form.name} onChange={onChange} />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={onChange} />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Numero ng Telepono (opsyonal)</label>
            <input id="phone" name="phone" value={form.phone} onChange={onChange} />
          </div>
          <div className="form-field">
            <label htmlFor="message">Mensahe</label>
            <textarea id="message" name="message" rows={5} required value={form.message} onChange={onChange} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Ipinapadala…' : 'Ipadala ang Mensahe'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 48,
    alignItems: 'flex-start'
  },
  intro: { position: 'sticky', top: 100 },
  infoCard: { padding: 20, marginTop: 24 },
  infoLine: { fontSize: 14, margin: '0 0 8px' },
  form: { padding: 28 }
};
