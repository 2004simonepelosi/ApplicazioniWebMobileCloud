import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const API = import.meta.env.VITE_API_URL;

function HomeAdmin() {
    const [statistiche, setStatistiche] = useState(null);
    const [prenotazioni, setPrenotazioni] = useState([]);
    const [utenti, setUtenti] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const u = localStorage.getItem('utente');
        if (!u) { navigate('/login'); return; }
        const utente = JSON.parse(u);
        if (utente.ruolo !== 'admin') { navigate('/'); return; }

        Promise.all([
            fetch(`${API}/admin/statistiche`).then(r => r.json()),
            fetch(`${API}/admin/prenotazioni`).then(r => r.json()),
            fetch(`${API}/utenti`).then(r => r.json()),
        ]).then(([stats, pren, uts]) => {
            setStatistiche(stats);
            setPrenotazioni(pren);
            setUtenti(uts);
            setCaricamento(false);
        });
    }, []);

    const coloreStato = (stato) => {
        if (stato === 'confermata') return { bg: '#F0FDF4', color: '#2D6A4F' };
        if (stato === 'cancellata') return { bg: '#FEF2F2', color: '#C0392B' };
        return { bg: '#FFF7ED', color: '#E85D04' };
    };

    const getCardBgSport = (sport) => {
        const s = sport?.toLowerCase();
        if (s === 'calcio') return '#2D6A4F';
        if (s === 'tennis') return '#8B5E3C';
        if (s === 'padel') return '#1E3A5F';
        if (s === 'basket') return '#E85D04';
        return '#888780';
    };

    if (caricamento) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F5F0E8' }}>
            <p style={{ color: '#888780', fontSize: '14px' }}>Caricamento...</p>
        </div>
    );

    const prenotazioniAttesa = prenotazioni.filter(p => p.stato === 'in attesa');
    const ultimePrenotazioni = prenotazioni.slice(0, 5);
    const ultimiUtenti = [...utenti].reverse().slice(0, 4);
    const oggi = new Date().toISOString().split('T')[0];
    const prenotazioniOggi = prenotazioni.filter(p => p.data === oggi).length;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
            <Sidebar />

            <div className="main-content" style={{ marginLeft: '220px', flex: 1, padding: '28px', paddingBottom: '60px' }}>

                {/* HEADER */}
                <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '12px', color: '#888780', margin: '0 0 2px', fontWeight: 500, letterSpacing: '0.5px' }}>
                        {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>Benvenuto, Admin 👋</p>
                </div>

                {/* STATISTICHE */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '18px', border: '0.5px solid #E8E0D0' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                            <i className="ti ti-users" style={{ fontSize: '18px', color: '#2D6A4F' }} aria-hidden="true"></i>
                        </div>
                        <p style={{ fontSize: '28px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 2px' }}>{statistiche.totaleUtenti}</p>
                        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Utenti registrati</p>
                    </div>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '18px', border: '0.5px solid #E8E0D0' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                            <i className="ti ti-layout-grid" style={{ fontSize: '18px', color: '#1E3A5F' }} aria-hidden="true"></i>
                        </div>
                        <p style={{ fontSize: '28px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 2px' }}>{statistiche.totaleCampi}</p>
                        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Campi attivi</p>
                    </div>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '18px', border: '0.5px solid #E8E0D0' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                            <i className="ti ti-calendar-event" style={{ fontSize: '18px', color: '#E85D04' }} aria-hidden="true"></i>
                        </div>
                        <p style={{ fontSize: '28px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 2px' }}>{prenotazioniOggi}</p>
                        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Prenotazioni oggi</p>
                    </div>
                    <div style={{ background: prenotazioniAttesa.length > 0 ? '#FFF7ED' : 'white', borderRadius: '16px', padding: '18px', border: prenotazioniAttesa.length > 0 ? '0.5px solid #FED7AA' : '0.5px solid #E8E0D0', cursor: prenotazioniAttesa.length > 0 ? 'pointer' : 'default' }} onClick={() => prenotazioniAttesa.length > 0 && navigate('/admin')}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                            <i className="ti ti-clock" style={{ fontSize: '18px', color: '#E85D04' }} aria-hidden="true"></i>
                        </div>
                        <p style={{ fontSize: '28px', fontWeight: 500, color: prenotazioniAttesa.length > 0 ? '#E85D04' : '#1A1A1A', margin: '0 0 2px' }}>{prenotazioniAttesa.length}</p>
                        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>In attesa {prenotazioniAttesa.length > 0 && '→'}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>

                    {/* ULTIME PRENOTAZIONI */}
                    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '0.5px solid #E8E0D0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>Ultime prenotazioni</p>
                            <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#2D6A4F', cursor: 'pointer', fontWeight: 500 }}>Vedi tutte →</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {ultimePrenotazioni.length === 0 ? (
                                <p style={{ color: '#888780', fontSize: '13px' }}>Nessuna prenotazione ancora.</p>
                            ) : ultimePrenotazioni.map(p => {
                                const { bg, color } = coloreStato(p.stato);
                                return (
                                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: '#F5F0E8', borderRadius: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: getCardBgSport(p.sport), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span style={{ fontSize: '10px', fontWeight: 600, color: 'white' }}>{p.sport?.slice(0, 3).toUpperCase()}</span>
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome_campo}</p>
                                            <p style={{ fontSize: '11px', color: '#888780', margin: 0 }}>{p.nome_utente} · {p.data}</p>
                                        </div>
                                        <span style={{ background: bg, color, fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '100px', flexShrink: 0 }}>{p.stato}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* PANNELLO DESTRA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* ULTIMI UTENTI */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '0.5px solid #E8E0D0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>Utenti recenti</p>
                                <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#2D6A4F', cursor: 'pointer', fontWeight: 500 }}>Gestisci →</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {ultimiUtenti.map(u => (
                                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500, color: '#2D6A4F', flexShrink: 0 }}>
                                            {u.nome[0]}{u.cognome?.[0]}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.nome} {u.cognome}</p>
                                        </div>
                                        <span style={{ fontSize: '10px', color: u.ruolo === 'admin' ? '#C0392B' : u.ruolo === 'gestore' ? '#E85D04' : '#2D6A4F', fontWeight: 500 }}>{u.ruolo}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ACCESSO RAPIDO */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '0.5px solid #E8E0D0' }}>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 14px' }}>Accesso rapido</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button onClick={() => navigate('/admin')} style={{ background: '#F0FDF4', border: 'none', borderRadius: '10px', padding: '10px 14px', color: '#2D6A4F', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="ti ti-crown" style={{ fontSize: '16px' }} aria-hidden="true"></i>
                                    Gestione utenti e ruoli
                                </button>
                                <button onClick={() => navigate('/gestore')} style={{ background: '#EFF6FF', border: 'none', borderRadius: '10px', padding: '10px 14px', color: '#1E3A5F', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="ti ti-settings" style={{ fontSize: '16px' }} aria-hidden="true"></i>
                                    Gestione campi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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

export default HomeAdmin;