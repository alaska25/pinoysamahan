import React, { useState } from 'react';
import client from '../api/client';
import Sunburst from '../components/Sunburst';

const initial = { name: '', email: '', phone: '', prefecture: '', message: '' };

export default function Join() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', text }
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await client.post('/contact', { ...form, type: 'join' });
      setStatus({ type: 'success', text: 'Salamat! Natanggap namin ang iyong request. Mag-e-email kami sa iyo sa lalong madaling panahon.' });
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
          <span className="eyebrow"><Sunburst size={14} /> Sumali</span>
          <h1>Maging bahagi ng Samahan</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Libre ang pagsali sa Samahan ng Pinoy | Pinoy sa Japan. I-fill up ang form
            at makakatanggap ka ng updates tungkol sa events, tulong, at community news.
          </p>
          <ul style={styles.benefits}>
            <li>🎉 Imbitasyon sa mga fiesta at gatherings</li>
            <li>🤝 Access sa suporta ng kapwa Pilipino</li>
            <li>📰 Regular na balita at updates</li>
            <li>📇 Opsyonal na listing sa Member Directory</li>
          </ul>
        </div>

        <form className="card" style={styles.form} onSubmit={onSubmit}>
          {status && (
            <div className={`status-message ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
              {status.text}
            </div>
          )}
          <div className="form-field">
            <label htmlFor="name">Buong Pangalan</label>
            <input id="name" name="name" required value={form.name} onChange={onChange} />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={onChange} />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Numero ng Telepono</label>
            <input id="phone" name="phone" value={form.phone} onChange={onChange} />
          </div>
          <div className="form-field">
            <label htmlFor="prefecture">Prefektura</label>
            <input id="prefecture" name="prefecture" placeholder="hal. Osaka, Tokyo, Aichi" value={form.prefecture} onChange={onChange} />
          </div>
          <div className="form-field">
            <label htmlFor="message">Bakit ka gustong sumali? (opsyonal)</label>
            <textarea id="message" name="message" rows={4} value={form.message} onChange={onChange} placeholder="Ikwento mo nang kaunti ang tungkol sa iyo" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Sinusumite…' : 'Sumali sa Samahan'}
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
  benefits: {
    listStyle: 'none',
    padding: 0,
    marginTop: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    fontSize: 15
  },
  form: { padding: 28 }
};
