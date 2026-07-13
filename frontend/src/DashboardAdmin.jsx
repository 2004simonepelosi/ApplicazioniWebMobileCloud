import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const API = import.meta.env.VITE_API_URL;

function DashboardAdmin() {
  const [utenti, setUtenti] = useState([]);
  const [statistiche, setStatistiche] = useState(null);
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [tab, setTab] = useState('overview');
  const [messaggio, setMessaggio] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const utenteSalvato = localStorage.getItem('utente');
    if (!utenteSalvato) { navigate('/login'); return; }
    const u = JSON.parse(utenteSalvato);
    if (u.ruolo !== 'admin') { navigate('/'); return; }

    Promise.all([
      fetch(`${API}/utenti`).then(r => r.json()),
      fetch(`${API}/admin/statistiche`).then(r => r.json()),
      fetch(`${API}/admin/prenotazioni`).then(r => r.json()),
    ]).then(([utentiData, statsData, prenotazioniData]) => {
      setUtenti(utentiData);
      setStatistiche(statsData);
      setPrenotazioni(prenotazioniData);
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

  const coloreStato = (stato) => {
    if (stato === 'confermata') return { bg: '#F0FDF4', color: '#2D6A4F' };
    if (stato === 'cancellata') return { bg: '#FEF2F2', color: '#C0392B' };
    return { bg: '#FFF7ED', color: '#E85D04' };
  };

  const getCardBgSport = (sport) => {
    const s = sport?.toLowerCase();
    if (s === 'calcio') return '#D8F3DC';
    if (s === 'tennis') return '#F5E6D3';
    if (s === 'padel') return '#DBEAFE';
    if (s === 'basket') return '#FFEDD5';
    return '#F1EFE8';
  };

  const getColorSport = (sport) => {
    const s = sport?.toLowerCase();
    if (s === 'calcio') return '#1B4332';
    if (s === 'tennis') return '#6B3A1F';
    if (s === 'padel') return '#1E3A5F';
    if (s === 'basket') return '#C2410C';
    return '#5F5E5A';
  };

  if (caricamento) return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F5F0E8' }}>
        <p style={{ color: '#888780', fontSize: '14px' }}>Caricamento...</p>
      </div>
  );

  return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
        <Sidebar />

        <div className="main-content" style={{ marginLeft: '220px', flex: 1, padding: '28px', paddingBottom: '100px' }}>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: '#888780', margin: '0 0 2px', fontWeight: 500, letterSpacing: '0.5px' }}>PANNELLO</p>
            <p style={{ fontSize: '24px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>Dashboard Admin</p>
          </div>

          {/* STATISTICHE */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '0.5px solid #E8E0D0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-users" style={{ fontSize: '18px', color: '#2D6A4F' }} aria-hidden="true"></i>
                </div>
                <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Utenti totali</p>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>{statistiche.totaleUtenti}</p>
              <p style={{ fontSize: '12px', color: '#888780', margin: '4px 0 0' }}>{statistiche.totaleGestori} gestori</p>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '0.5px solid #E8E0D0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-layout-grid" style={{ fontSize: '18px', color: '#1E3A5F' }} aria-hidden="true"></i>
                </div>
                <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Campi attivi</p>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>{statistiche.totaleCampi}</p>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '0.5px solid #E8E0D0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-calendar-event" style={{ fontSize: '18px', color: '#E85D04' }} aria-hidden="true"></i>
                </div>
                <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Prenotazioni</p>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>{statistiche.totalePrenotazioni}</p>
              <p style={{ fontSize: '12px', color: '#888780', margin: '4px 0 0' }}>{statistiche.prenotazioniAttesa} in attesa · {statistiche.prenotazioniConfermate} confermate</p>
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[
              { id: 'overview', label: 'Prenotazioni' },
              { id: 'utenti', label: 'Utenti' },
            ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? '#2D6A4F' : 'white', color: tab === t.id ? 'white' : '#5F5E5A', fontSize: '13px', fontWeight: tab === t.id ? 500 : 400, padding: '7px 18px', borderRadius: '100px', border: tab === t.id ? 'none' : '0.5px solid #E8E0D0', cursor: 'pointer' }}>
                  {t.label}
                </button>
            ))}
          </div>

          {messaggio && (
              <div style={{ background: '#F0FDF4', border: '0.5px solid #B7E4C7', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px' }}>
                <p style={{ color: '#2D6A4F', fontSize: '13px', fontWeight: 500, margin: 0 }}>✅ {messaggio}</p>
              </div>
          )}

          {/* TAB PRENOTAZIONI */}
          {tab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#888780', margin: '0 0 4px', letterSpacing: '0.3px' }}>TUTTE LE PRENOTAZIONI</p>
                {prenotazioni.length === 0 ? (
                    <p style={{ color: '#888780', fontSize: '14px' }}>Nessuna prenotazione ancora.</p>
                ) : prenotazioni.map(p => {
                  const { bg, color } = coloreStato(p.stato);
                  return (
                      <div key={p.id} style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', border: '0.5px solid #E8E0D0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: getCardBgSport(p.sport), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: getColorSport(p.sport) }}>{p.sport?.slice(0, 3).toUpperCase()}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 2px' }}>{p.nome_campo}</p>
                              <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>{p.nome_utente} {p.cognome_utente} · {p.data} · {p.ora_inizio} - {p.ora_fine}</p>
                            </div>
                            <span style={{ background: bg, color, fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '100px', flexShrink: 0 }}>{p.stato}</span>
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>
          )}

          {/* TAB UTENTI */}
          {tab === 'utenti' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#888780', margin: '0 0 4px', letterSpacing: '0.3px' }}>GESTIONE UTENTI</p>
                {utenti.map(u => {
                  const ruoloBg = u.ruolo === 'admin' ? '#FEF2F2' : u.ruolo === 'gestore' ? '#FFF7ED' : '#F0FDF4';
                  const ruoloColor = u.ruolo === 'admin' ? '#C0392B' : u.ruolo === 'gestore' ? '#E85D04' : '#2D6A4F';
                  return (
                      <div key={u.id} style={{ background: 'white', borderRadius: '14px', padding: '14px 20px', border: '0.5px solid #E8E0D0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 500, color: '#1A1A1A', flexShrink: 0 }}>
                          {u.nome[0]}{u.cognome?.[0]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 2px' }}>{u.nome} {u.cognome}</p>
                          <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>{u.email}</p>
                        </div>
                        <span style={{ background: ruoloBg, color: ruoloColor, fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '100px', marginRight: '8px' }}>{u.ruolo}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {['utente', 'gestore', 'admin'].map(r => (
                              <button key={r} onClick={() => handleCambioRuolo(u.id, r)} disabled={u.ruolo === r} style={{ background: u.ruolo === r ? '#F5F0E8' : 'white', border: '0.5px solid #E8E0D0', borderRadius: '8px', padding: '5px 10px', color: u.ruolo === r ? '#B4B2A9' : '#5F5E5A', fontSize: '11px', cursor: u.ruolo === r ? 'default' : 'pointer', opacity: u.ruolo === r ? 0.5 : 1 }}>
                                {r}
                              </button>
                          ))}
                        </div>
                      </div>
                  );
                })}
              </div>
          )}
        </div>

        <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .main-content { margin-left: 0 !important; padding: 20px 16px !important; }
        }
        @media (min-width: 769px) {
          .sidebar-desktop { display: flex !important; }
        }
      `}</style>
      </div>
  );
}

export default DashboardAdmin;