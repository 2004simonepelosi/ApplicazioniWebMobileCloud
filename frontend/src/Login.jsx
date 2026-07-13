import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errore, setErrore] = useState('');
    const [caricamento, setCaricamento] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrore('');
        setCaricamento(true);

        const risposta = await fetch(`${API}/utenti/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const dati = await risposta.json();
        setCaricamento(false);

        if (!risposta.ok) { setErrore(dati.errore); return; }

        localStorage.setItem('utente', JSON.stringify(dati.utente));

        if (dati.cambioPasswordRichiesto) { navigate('/cambio-password'); return; }

        const destinazione = location.state?.tornaA || '/';
        navigate(destinazione);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#2D6A4F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>⚽</div>
                    <p style={{ fontSize: '26px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 6px' }}>Bentornato</p>
                    <p style={{ fontSize: '14px', color: '#888780', margin: 0 }}>Accedi per prenotare il tuo campo</p>
                </div>

                <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '0.5px solid #E8E0D0' }}>
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>EMAIL</label>
                            <input
                                type="email"
                                placeholder="nome@esempio.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>PASSWORD</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        {errore && (
                            <div style={{ background: '#FEF2F2', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', border: '0.5px solid #FECACA' }}>
                                <p style={{ color: '#C0392B', fontSize: '13px', margin: 0 }}>⚠️ {errore}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={caricamento}
                            style={{ width: '100%', background: '#2D6A4F', border: 'none', borderRadius: '12px', padding: '14px 0', color: 'white', fontWeight: 500, fontSize: '15px', cursor: 'pointer' }}
                        >
                            {caricamento ? 'Accesso in corso...' : 'Accedi'}
                        </button>
                    </form>

                    <p style={{ fontSize: '13px', color: '#888780', textAlign: 'center', marginTop: '20px', marginBottom: 0 }}>
                        Non hai un account? <Link to="/registrazione" style={{ color: '#2D6A4F', fontWeight: 500, textDecoration: 'none' }}>Registrati</Link>
                    </p>
                </div>

                <p onClick={() => navigate('/')} style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#888780', cursor: 'pointer' }}>← Torna alla home</p>
            </div>
        </div>
    );
}

export default Login;