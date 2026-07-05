import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

function Profilo() {
    const [utente, setUtente] = useState(null);
    const [prenotazioni, setPrenotazioni] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const utenteSalvato = localStorage.getItem('utente');
        if (!utenteSalvato) { navigate('/login'); return; }
        const u = JSON.parse(utenteSalvato);
        setUtente(u);
        fetch(`${API}/prenotazioni/utente/${u.id}`)
            .then(r => r.json())
            .then(dati => setPrenotazioni(dati));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('utente');
        navigate('/');
    };

    if (!utente) return null;

    const iniziali = utente.nome[0] + utente.cognome[0];
    const totalePrenotazioni = prenotazioni.length;
    const prenotazioniAttive = prenotazioni.filter(p => p.stato !== 'cancellata').length;

    return (
        <div style={styles.schermo}>
            <button onClick={() => navigate('/')} style={styles.bottoneIndietro}>← Indietro</button>
            <div style={styles.avatarBox}>
                <div style={styles.avatar}>{iniziali.toUpperCase()}</div>
                <p style={styles.nomeCompleto}>{utente.nome} {utente.cognome}</p>
                <span style={styles.ruoloBadge}>{utente.ruolo}</span>
            </div>
            <div style={styles.stats}>
                <div style={styles.statCard}><p style={styles.statNumero}>{totalePrenotazioni}</p><p style={styles.statLabel}>Prenotazioni</p></div>
                <div style={styles.statCard}><p style={styles.statNumero}>{prenotazioniAttive}</p><p style={styles.statLabel}>Attive</p></div>
                <div style={styles.statCard}><p style={styles.statNumero}>{totalePrenotazioni - prenotazioniAttive}</p><p style={styles.statLabel}>Cancellate</p></div>
            </div>
            <div style={styles.menu}>
                <div style={styles.voceMenu} onClick={() => navigate('/prenotazioni')}>
                    <span style={styles.voceMenuTesto}>Le mie prenotazioni</span>
                    <span style={styles.freccia}>→</span>
                </div>
                <div style={styles.separatore} />
                <div style={styles.voceMenu}>
                    <span style={styles.voceMenuTesto}>Email</span>
                    <span style={styles.voceMenuValore}>{utente.email}</span>
                </div>
                <div style={styles.separatore} />
                <div style={styles.voceMenu} onClick={handleLogout}>
                    <span style={{ ...styles.voceMenuTesto, color: '#F09595' }}>Esci</span>
                </div>
            </div>
        </div>
    );
}

const styles = {
    schermo: { background: '#0F1115', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '420px', margin: '0 auto', minHeight: '600px', boxSizing: 'border-box' },
    bottoneIndietro: { background: 'none', border: 'none', color: '#FAEEDA', fontSize: '14px', cursor: 'pointer', padding: 0, marginBottom: '20px' },
    avatarBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' },
    avatar: { width: '72px', height: '72px', borderRadius: '50%', background: '#FAC775', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 500, color: '#412402', marginBottom: '12px' },
    nomeCompleto: { color: '#FAEEDA', fontSize: '18px', fontWeight: 500, margin: '0 0 8px' },
    ruoloBadge: { background: '#1C1F26', color: '#888780', fontSize: '12px', padding: '4px 12px', borderRadius: '100px' },
    stats: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '24px' },
    statCard: { background: '#1C1F26', borderRadius: '14px', padding: '12px', textAlign: 'center' },
    statNumero: { color: '#FAEEDA', fontSize: '22px', fontWeight: 500, margin: '0 0 2px' },
    statLabel: { color: '#888780', fontSize: '11px', margin: 0 },
    menu: { background: '#1C1F26', borderRadius: '16px', padding: '4px 0' },
    voceMenu: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', cursor: 'pointer' },
    voceMenuTesto: { color: '#FAEEDA', fontSize: '14px' },
    voceMenuValore: { color: '#888780', fontSize: '13px' },
    freccia: { color: '#5F5E5A', fontSize: '16px' },
    separatore: { height: '0.5px', background: 'rgba(255,255,255,0.06)', margin: '0 16px' }
};

export default Profilo;