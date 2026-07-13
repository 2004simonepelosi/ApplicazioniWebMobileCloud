import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

function CambioPassword() {
    const [nuovaPassword, setNuovaPassword] = useState('');
    const [confermaPassword, setConfermaPassword] = useState('');
    const [errore, setErrore] = useState('');
    const [caricamento, setCaricamento] = useState(false);
    const navigate = useNavigate();

    const handleCambio = async (e) => {
        e.preventDefault();
        setErrore('');

        if (nuovaPassword !== confermaPassword) { setErrore('Le password non coincidono'); return; }
        if (nuovaPassword.length < 6) { setErrore('La password deve essere di almeno 6 caratteri'); return; }

        const utenteSalvato = localStorage.getItem('utente');
        if (!utenteSalvato) { navigate('/login'); return; }
        const utente = JSON.parse(utenteSalvato);

        setCaricamento(true);
        const risposta = await fetch(`${API}/utenti/${utente.id}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nuovaPassword })
        });

        const dati = await risposta.json();
        setCaricamento(false);

        if (!risposta.ok) { setErrore(dati.errore); return; }

        navigate('/');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#2D6A4F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>🔐</div>
                    <p style={{ fontSize: '26px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 6px' }}>Cambia password</p>
                    <p style={{ fontSize: '14px', color: '#888780', margin: 0 }}>È il tuo primo accesso — scegli una password sicura</p>
                </div>

                <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '0.5px solid #E8E0D0' }}>
                    <form onSubmit={handleCambio}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>NUOVA PASSWORD</label>
                            <input
                                type="password"
                                placeholder="Almeno 6 caratteri"
                                value={nuovaPassword}
                                onChange={e => setNuovaPassword(e.target.value)}
                                style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>CONFERMA PASSWORD</label>
                            <input
                                type="password"
                                placeholder="Ripeti la password"
                                value={confermaPassword}
                                onChange={e => setConfermaPassword(e.target.value)}
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
                            {caricamento ? 'Salvataggio...' : 'Salva password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CambioPassword;