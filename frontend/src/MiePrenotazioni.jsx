import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const API = import.meta.env.VITE_API_URL;

function MiePrenotazioni() {
    const [prenotazioni, setPrenotazioni] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const [tab, setTab] = useState('prossime');
    const navigate = useNavigate();

    useEffect(() => {
        const utenteSalvato = localStorage.getItem('utente');
        if (!utenteSalvato) { navigate('/login'); return; }
        const utente = JSON.parse(utenteSalvato);

        fetch(`${API}/prenotazioni/utente/${utente.id}`)
            .then(risposta => risposta.json())
            .then(dati => {
                setPrenotazioni(dati);
                setCaricamento(false);
            });
    }, []);

    const handleCancella = async (idPrenotazione) => {
        const risposta = await fetch(`${API}/prenotazioni/${idPrenotazione}/cancella`, { method: 'PUT' });
        if (risposta.ok) {
            setPrenotazioni(prev => prev.map(p => p.id === idPrenotazione ? { ...p, stato: 'cancellata' } : p));
        }
    };

    const oggi = new Date().toISOString().split('T')[0];
    const prossime = prenotazioni.filter(p => p.data >= oggi && p.stato !== 'cancellata');
    const passate = prenotazioni.filter(p => p.data < oggi || p.stato === 'cancellata');
    const lista = tab === 'prossime' ? prossime : passate;

    const coloreStato = (stato) => {
        if (stato === 'confermata') return '#2D6A4F';
        if (stato === 'cancellata') return '#C0392B';
        return '#E85D04';
    };

    const bgStato = (stato) => {
        if (stato === 'confermata') return '#F0FDF4';
        if (stato === 'cancellata') return '#FEF2F2';
        return '#FFF7ED';
    };

    const getCardAccent = (sport) => {
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

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
            <Sidebar />

            <div className="main-content" style={{ marginLeft: '220px', flex: 1, padding: '28px', paddingBottom: '100px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '12px', color: '#888780', margin: '0 0 2px', fontWeight: 500, letterSpacing: '0.5px' }}>LE TUE</p>
                    <p style={{ fontSize: '24px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>Prenotazioni</p>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <button onClick={() => setTab('prossime')} style={{ background: tab === 'prossime' ? '#2D6A4F' : 'white', color: tab === 'prossime' ? 'white' : '#5F5E5A', fontSize: '13px', fontWeight: tab === 'prossime' ? 500 : 400, padding: '7px 18px', borderRadius: '100px', border: tab === 'prossime' ? 'none' : '0.5px solid #E8E0D0', cursor: 'pointer' }}>
                        Prossime ({prossime.length})
                    </button>
                    <button onClick={() => setTab('passate')} style={{ background: tab === 'passate' ? '#2D6A4F' : 'white', color: tab === 'passate' ? 'white' : '#5F5E5A', fontSize: '13px', fontWeight: tab === 'passate' ? 500 : 400, padding: '7px 18px', borderRadius: '100px', border: tab === 'passate' ? 'none' : '0.5px solid #E8E0D0', cursor: 'pointer' }}>
                        Passate ({passate.length})
                    </button>
                </div>

                {lista.length === 0 ? (
                    <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                        <i className="ti ti-calendar-off" style={{ fontSize: '48px', color: '#D3D1C7' }} aria-hidden="true"></i>
                        <p style={{ color: '#888780', fontSize: '14px', marginTop: '12px' }}>
                            {tab === 'prossime' ? 'Nessuna prenotazione in arrivo' : 'Nessuna prenotazione passata'}
                        </p>
                        {tab === 'prossime' && (
                            <button onClick={() => navigate('/')} style={{ marginTop: '16px', background: '#2D6A4F', border: 'none', borderRadius: '10px', padding: '10px 20px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
                                Prenota un campo
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {lista.map((p) => (
                            <div key={p.id} style={{ background: 'white', borderRadius: '16px', padding: '0', border: '0.5px solid #E8E0D0', overflow: 'hidden', display: 'flex' }}>
                                <div style={{ width: '6px', background: getCardAccent(p.sport), flexShrink: 0 }}></div>
                                <div style={{ flex: 1, padding: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <div>
                                            <p style={{ fontSize: '15px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 2px' }}>{p.nome_campo}</p>
                                            <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>{p.sport}</p>
                                        </div>
                                        <span style={{ background: bgStato(p.stato), color: coloreStato(p.stato), fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '100px' }}>
                      {p.stato}
                    </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', marginBottom: p.stato !== 'cancellata' && p.data >= oggi ? '12px' : '0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <i className="ti ti-calendar" style={{ fontSize: '14px', color: '#888780' }} aria-hidden="true"></i>
                                            <span style={{ fontSize: '13px', color: '#888780' }}>{p.data}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <i className="ti ti-clock" style={{ fontSize: '14px', color: '#888780' }} aria-hidden="true"></i>
                                            <span style={{ fontSize: '13px', color: '#888780' }}>{p.ora_inizio} - {p.ora_fine}</span>
                                        </div>
                                    </div>
                                    {p.stato !== 'cancellata' && p.data >= oggi && (
                                        <button onClick={() => handleCancella(p.id)} style={{ background: 'none', border: '0.5px solid #E8E0D0', borderRadius: '8px', padding: '6px 14px', color: '#C0392B', fontSize: '12px', cursor: 'pointer' }}>
                                            Cancella prenotazione
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* TAB BAR MOBILE */}
            <div className="tabbar-mobile" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '0.5px solid #E8E0D0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '12px 0 20px', zIndex: 20 }}>
                <div onClick={() => navigate('/')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                    <i className="ti ti-home" style={{ fontSize: '22px', color: '#B4B2A9' }} aria-hidden="true"></i>
                    <span style={{ fontSize: '11px', color: '#B4B2A9' }}>Home</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <i className="ti ti-calendar-event" style={{ fontSize: '22px', color: '#2D6A4F' }} aria-hidden="true"></i>
                    <span style={{ fontSize: '11px', color: '#2D6A4F', fontWeight: 500 }}>Prenotazioni</span>
                </div>
                <div onClick={() => navigate('/notifiche')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                    <i className="ti ti-bell" style={{ fontSize: '22px', color: '#B4B2A9' }} aria-hidden="true"></i>
                    <span style={{ fontSize: '11px', color: '#B4B2A9' }}>Notifiche</span>
                </div>
                <div onClick={() => navigate('/profilo')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                    <i className="ti ti-user" style={{ fontSize: '22px', color: '#B4B2A9' }} aria-hidden="true"></i>
                    <span style={{ fontSize: '11px', color: '#B4B2A9' }}>Profilo</span>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .main-content { margin-left: 0 !important; padding: 20px 16px !important; }
          .tabbar-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .tabbar-mobile { display: none !important; }
          .sidebar-desktop { display: flex !important; }
        }
      `}</style>
        </div>
    );
}

export default MiePrenotazioni;