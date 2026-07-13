import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

function Registrazione() {
    const [form, setForm] = useState({ nome: '', cognome: '', email: '', telefono: '', password: '' });
    const [errore, setErrore] = useState('');
    const [successo, setSuccesso] = useState(false);
    const [caricamento, setCaricamento] = useState(false);
    const navigate = useNavigate();

    const handleRegistrazione = async (e) => {
        e.preventDefault();
        setErrore('');
        setCaricamento(true);

        const risposta = await fetch(`${API}/utenti/registra`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        const dati = await risposta.json();
        setCaricamento(false);

        if (!risposta.ok) { setErrore(dati.errore); return; }

        setSuccesso(true);
        setTimeout(() => navigate('/login'), 2000);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '460px' }}>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#2D6A4F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>⚽</div>
                    <p style={{ fontSize: '26px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 6px' }}>Crea account</p>
                    <p style={{ fontSize: '14px', color: '#888780', margin: 0 }}>Inizia a prenotare i tuoi campi</p>
                </div>

                <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '0.5px solid #E8E0D0' }}>
                    <form onSubmit={handleRegistrazione}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>NOME</label>
                                <input
                                    type="text"
                                    placeholder="Mario"
                                    value={form.nome}
                                    onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                                    style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>COGNOME</label>
                                <input
                                    type="text"
                                    placeholder="Rossi"
                                    value={form.cognome}
                                    onChange={e => setForm(p => ({ ...p, cognome: e.target.value }))}
                                    style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>EMAIL</label>
                            <input
                                type="email"
                                placeholder="mario@esempio.com"
                                value={form.email}
                                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>TELEFONO</label>
                            <input
                                type="tel"
                                placeholder="+39 333 1234567"
                                value={form.telefono}
                                onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
                                style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>PASSWORD</label>
                            <input
                                type="password"
                                placeholder="Almeno 6 caratteri"
                                value={form.password}
                                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        {errore && (
                            <div style={{ background: '#FEF2F2', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', border: '0.5px solid #FECACA' }}>
                                <p style={{ color: '#C0392B', fontSize: '13px', margin: 0 }}>⚠️ {errore}</p>
                            </div>
                        )}

                        {successo && (
                            <div style={{ background: '#F0FDF4', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', border: '0.5px solid #B7E4C7' }}>
                                <p style={{ color: '#2D6A4F', fontSize: '13px', margin: 0 }}>✅ Registrazione completata! Reindirizzo al login...</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={caricamento}
                            style={{ width: '100%', background: '#2D6A4F', border: 'none', borderRadius: '12px', padding: '14px 0', color: 'white', fontWeight: 500, fontSize: '15px', cursor: 'pointer' }}
                        >
                            {caricamento ? 'Registrazione in corso...' : 'Registrati'}
                        </button>
                    </form>

                    <p style={{ fontSize: '13px', color: '#888780', textAlign: 'center', marginTop: '20px', marginBottom: 0 }}>
                        Hai già un account? <Link to="/login" style={{ color: '#2D6A4F', fontWeight: 500, textDecoration: 'none' }}>Accedi</Link>
                    </p>
                </div>

                <p onClick={() => navigate('/')} style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#888780', cursor: 'pointer' }}>← Torna alla home</p>
            </div>
        </div>
    );
}

export default Registrazione;