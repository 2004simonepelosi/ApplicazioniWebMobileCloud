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

        if (nuovaPassword !== confermaPassword) {
            setErrore('Le password non coincidono');
            return;
        }

        if (nuovaPassword.length < 6) {
            setErrore('La password deve essere di almeno 6 caratteri');
            return;
        }

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

        if (!risposta.ok) {
            setErrore(dati.errore);
            return;
        }

        navigate('/');
    };

    return (
        <div style={styles.schermo}>
            <div style={styles.icona}>🔐</div>
            <h1 style={styles.titolo}>Cambia password</h1>
            <p style={styles.sottotitolo}>È il tuo primo accesso — scegli una password sicura</p>

            <form onSubmit={handleCambio}>
                <label style={styles.label}>NUOVA PASSWORD</label>
                <input
                    type="password"
                    placeholder="Almeno 6 caratteri"
                    value={nuovaPassword}
                    onChange={(e) => setNuovaPassword(e.target.value)}
                    style={styles.input}
                />
                <label style={styles.label}>CONFERMA PASSWORD</label>
                <input
                    type="password"
                    placeholder="Ripeti la password"
                    value={confermaPassword}
                    onChange={(e) => setConfermaPassword(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.bottone} disabled={caricamento}>
                    {caricamento ? 'Salvataggio...' : 'Salva password'}
                </button>
            </form>

            {errore && <p style={styles.errore}>{errore}</p>}
        </div>
    );
}

const styles = {
    schermo: { background: '#0F1115', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '420px', margin: '0 auto', minHeight: '600px', boxSizing: 'border-box' },
    icona: { fontSize: '40px', marginBottom: '20px' },
    titolo: { color: '#FAEEDA', fontSize: '26px', fontWeight: 500, margin: '0 0 6px' },
    sottotitolo: { color: '#888780', fontSize: '14px', margin: '0 0 32px' },
    label: { display: 'block', color: '#888780', fontSize: '12px', fontWeight: 500, marginBottom: '6px' },
    input: { width: '100%', background: '#1C1F26', border: 'none', borderRadius: '14px', padding: '14px 16px', marginBottom: '14px', color: '#FAEEDA', fontSize: '14px', boxSizing: 'border-box' },
    bottone: { width: '100%', background: '#FAC775', border: 'none', borderRadius: '14px', padding: '15px 0', color: '#412402', fontWeight: 500, fontSize: '15px', cursor: 'pointer', marginTop: '8px' },
    errore: { color: '#F09595', fontSize: '13px', marginTop: '12px' }
};

export default CambioPassword;