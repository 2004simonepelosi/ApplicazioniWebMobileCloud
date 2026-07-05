import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

function DashboardAdmin() {
  const [utenti, setUtenti] = useState([]);
  const [campi, setCampi] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [messaggio, setMessaggio] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const utenteSalvato = localStorage.getItem('utente');
    if (!utenteSalvato) { navigate('/login'); return; }
    const u = JSON.parse(utenteSalvato);
    if (u.ruolo !== 'admin') { navigate('/'); return; }

    Promise.all([
      fetch(`${API}/utenti`).then(r => r.json()),
      fetch(`${API}/campi`).then(r => r.json())
    ]).then(([utentiData, campiData]) => {
      setUtenti(utentiData);
      setCampi(campiData);
      setCaricamento(false);
    });
  }, []);

  const handleCambioRuolo = async (idUtente, nuovoRuolo) => {
    const risposta = await fetch(`${API}/utenti/${idUtente}/ruolo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruolo: nuovoRuolo })
    });

    if (risposta.ok) {
      setUtenti(prev => prev.map(u => u.id === idUtente ? { ...u, ruolo: nuovoRuolo } : u));
      setMessaggio('Ruolo aggiornato!');
      setTimeout(() => setMessaggio(''), 2000);
    }
  };

  const coloreRuolo = (ruolo) => {
    if (ruolo === 'admin') return '#F09595';
    if (ruolo === 'gestore') return '#FAC775';
    return '#888780';
  };

  if (caricamento) return <p style={{ color: '#FAEEDA' }}>Caricamento...</p>;

  return (
    <div style={styles.schermo}>
      <button onClick={() => navigate('/')} style={styles.bottoneIndietro}>← Indietro</button>
      <p style={styles.titolo}>Dashboard Admin</p>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <p style={styles.statNumero}>{utenti.length}</p>
          <p style={styles.statLabel}>Utenti totali</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumero}>{utenti.filter(u => u.ruolo === 'gestore').length}</p>
          <p style={styles.statLabel}>Gestori</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumero}>{campi.length}</p>
          <p style={styles.statLabel}>Campi attivi</p>
        </div>
      </div>

      {messaggio && <p style={styles.messaggio}>{messaggio}</p>}

      <p style={styles.sottotitolo}>Gestione utenti</p>

      <div style={styles.lista}>
        {utenti.map(u => (
          <div key={u.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.nomeUtente}>{u.nome} {u.cognome}</p>
                <p style={styles.email}>{u.email}</p>
              </div>
              <span style={{ ...styles.ruoloBadge, color: coloreRuolo(u.ruolo) }}>{u.ruolo}</span>
            </div>
            <div style={styles.azioni}>
              <button
                onClick={() => handleCambioRuolo(u.id, 'utente')}
                style={{ ...styles.bottoneRuolo, opacity: u.ruolo === 'utente' ? 0.4 : 1 }}
                disabled={u.ruolo === 'utente'}
              >
                Utente
              </button>
              <button
                onClick={() => handleCambioRuolo(u.id, 'gestore')}
                style={{ ...styles.bottoneRuolo, opacity: u.ruolo === 'gestore' ? 0.4 : 1 }}
                disabled={u.ruolo === 'gestore'}
              >
                Gestore
              </button>
              <button
                onClick={() => handleCambioRuolo(u.id, 'admin')}
                style={{ ...styles.bottoneRuolo, opacity: u.ruolo === 'admin' ? 0.4 : 1 }}
                disabled={u.ruolo === 'admin'}
              >
                Admin
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  schermo: { background: '#0F1115', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '420px', margin: '0 auto', minHeight: '600px', boxSizing: 'border-box' },
  bottoneIndietro: { background: 'none', border: 'none', color: '#FAEEDA', fontSize: '14px', cursor: 'pointer', padding: 0, marginBottom: '20px' },
  titolo: { color: '#FAEEDA', fontSize: '24px', fontWeight: 500, margin: '0 0 20px' },
  stats: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '24px' },
  statCard: { background: '#1C1F26', borderRadius: '14px', padding: '12px', textAlign: 'center' },
  statNumero: { color: '#FAEEDA', fontSize: '22px', fontWeight: 500, margin: '0 0 2px' },
  statLabel: { color: '#888780', fontSize: '11px', margin: 0 },
  messaggio: { color: '#97C459', fontSize: '13px', marginBottom: '12px' },
  sottotitolo: { color: '#FAEEDA', fontSize: '16px', fontWeight: 500, margin: '0 0 12px' },
  lista: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: { background: '#1C1F26', borderRadius: '14px', padding: '14px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  nomeUtente: { color: '#FAEEDA', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' },
  email: { color: '#888780', fontSize: '12px', margin: 0 },
  ruoloBadge: { fontSize: '12px', fontWeight: 500 },
  azioni: { display: 'flex', gap: '6px' },
  bottoneRuolo: { flex: 1, background: '#0F1115', border: '1px solid #2C2F36', borderRadius: '8px', padding: '6px 0', color: '#B4B2A9', fontSize: '12px', cursor: 'pointer' }
};

export default DashboardAdmin;