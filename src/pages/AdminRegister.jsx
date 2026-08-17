import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sunburst from '../components/Sunburst';

export default function AdminRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-auth">
      <style>{`
        .admin-auth {
          min-height: calc(100vh - 80px);
          display: flex;
        }
        .admin-auth__panel {
          flex: 1 1 46%;
          background: #0a1638;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px;
          color: #f4f1ea;
        }
        .admin-auth__rays {
          position: absolute;
          top: 50%;
          left: -10%;
          width: 900px;
          height: 900px;
          transform: translateY(-50%);
          opacity: 0.14;
          pointer-events: none;
          transition: transform 0.8s ease;
        }
        .admin-auth__panel:hover .admin-auth__rays {
          transform: translateY(-50%) rotate(10deg);
        }
        .admin-auth__ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 450px;
          background: linear-gradient(to bottom, #e0a52c, transparent);
          transform-origin: top center;
        }
        .admin-auth__brand {
          position: relative;
          z-index: 1;
        }
        .admin-auth__brand-mark {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #e0a52c;
          font-size: 13px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .admin-auth__title {
          font-size: 42px;
          line-height: 1.15;
          margin: 0 0 20px;
          max-width: 420px;
          color: #f4f1ea;
        }
        .admin-auth__sub {
          color: rgba(244,241,234,0.72);
          max-width: 380px;
          line-height: 1.6;
          margin: 0;
        }
        .admin-auth__right {
          flex: 1 1 54%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f1ea;
          padding: 40px 24px;
        }
        .admin-auth__card {
          width: 100%;
          max-width: 400px;
        }
        .admin-auth__logo-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 32px;
        }
        .admin-auth__logo-row img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          transition: transform 0.25s ease;
        }
        .admin-auth__logo-row img:hover {
          transform: scale(1.06) rotate(-4deg);
        }
        .admin-auth__logo-row h1 {
          font-size: 22px;
          margin: 0;
        }
        .admin-auth__right .form-field input {
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .admin-auth__right .form-field input:hover {
          border-color: #0a1638;
        }
        .admin-auth__right .form-field input:focus {
          outline: none;
          border-color: #0a1638;
          box-shadow: 0 0 0 3px rgba(10,22,56,0.12);
        }
        .admin-auth__right .btn-primary {
          transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
        }
        .admin-auth__right .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(224,165,44,0.4);
          filter: brightness(1.06);
        }
        .admin-auth__right .btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }
        .admin-auth__register {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: var(--color-text-muted);
        }
        .admin-auth__register a {
          color: #0a1638;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .admin-auth__register a:hover {
          border-color: #e0a52c;
          color: #0a1638;
        }
        @media (prefers-reduced-motion: reduce) {
          .admin-auth__rays,
          .admin-auth__logo-row img,
          .admin-auth__right .btn-primary,
          .admin-auth__register a {
            transition: none;
          }
          .admin-auth__panel:hover .admin-auth__rays {
            transform: translateY(-50%);
          }
        }
        @media (max-width: 860px) {
          .admin-auth { flex-direction: column; }
          .admin-auth__panel {
            flex: none;
            padding: 40px 28px;
            min-height: 220px;
            justify-content: flex-end;
          }
          .admin-auth__title { font-size: 28px; }
          .admin-auth__right { padding: 32px 20px; }
        }
      `}</style>

      <div className="admin-auth__panel">
        <div className="admin-auth__rays" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="admin-auth__ray"
              style={{ transform: `rotate(${i * (360 / 16)}deg)` }}
            />
          ))}
        </div>
        <div className="admin-auth__brand">
          <span className="admin-auth__brand-mark">
            <Sunburst size={16} /> Samahan ng Pinoy
          </span>
          <h1 className="admin-auth__title">Sumali sa mga namumuno.</h1>
          <p className="admin-auth__sub">
            Gumawa ng admin account para makatulong mag-manage ng events, balita, gallery, at miyembro ng Samahan ng Pinoy | Pinoy sa Japan.
          </p>
        </div>
      </div>

      <div className="admin-auth__right">
        <div className="admin-auth__card">
          <div className="admin-auth__logo-row">
            <img src="/logo.png" alt="Samahan ng Pinoy logo" />
            <h1>Admin Registration</h1>
          </div>

          <form className="card" style={{ padding: 28 }} onSubmit={onSubmit}>
            {error && <div className="status-message status-error">{error}</div>}
            <div className="form-field">
              <label htmlFor="name">Buong Pangalan</label>
              <input id="name" name="name" required value={form.name} onChange={onChange} />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={onChange} />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required minLength={8} value={form.password} onChange={onChange} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="admin-auth__register">
            May account na? <Link to="/admin/login">Sign in dito</Link>
          </p>
        </div>
      </div>
    </div>
  );
}