import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const API = import.meta.env.VITE_API_URL;

function Profilo() {
    const [utente, setUtente] = useState(null);
    const [prenotazioni, setPrenotazioni] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const utenteSalvato = localStorage.getItem('utente');
        if (!utenteSalvato) { navigate('/login'); return; }
        const u = JSON.parse(utenteSalvato);
        setUtente(u);
        fetch(`${API}/prenotazioni/utente/${u.id}`)
            .then(r => r.json())
            .then(setPrenotazioni);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('utente');
        navigate('/');
    };

    if (!utente) return null;

    const iniziali = utente.nome[0] + (utente.cognome?.[0] || '');
    const totale = prenotazioni?.length || 0;
    const confermate = prenotazioni?.filter(p => p.stato === 'confermata').length || 0;
    const attesa = prenotazioni?.filter(p => p.stato === 'in attesa').length || 0;

    const coloreRuolo = () => {
        if (utente.ruolo === 'admin') return { bg: '#FEF2F2', color: '#C0392B' };
        if (utente.ruolo === 'gestore') return { bg: '#FFF7ED', color: '#E85D04' };
        return { bg: '#F0FDF4', color: '#2D6A4F' };
    };

    const { bg, color } = coloreRuolo();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
            <Sidebar />

            <div className="main-content" style={{ marginLeft: '220px', flex: 1, padding: '28px', paddingBottom: '100px' }}>

                <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '12px', color: '#888780', margin: '0 0 2px', fontWeight: 500, letterSpacing: '0.5px' }}>IL TUO</p>
                    <p style={{ fontSize: '24px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>Profilo</p>
                </div>

                {/* CARD PROFILO */}
                <div style={{ background: '#2D6A4F', borderRadius: '24px', padding: '28px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 500, color: 'white', flexShrink: 0 }}>
                            {iniziali.toUpperCase()}
                        </div>
                        <div>
                            <p style={{ fontSize: '22px', fontWeight: 500, color: 'white', margin: '0 0 6px' }}>{utente.nome} {utente.cognome}</p>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px' }}>{utente.email}</p>
                            <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '100px' }}>
                {utente.ruolo}
              </span>
                        </div>
                    </div>
                </div>

                {/* STATISTICHE */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', border: '0.5px solid #E8E0D0', textAlign: 'center' }}>
                        <p style={{ fontSize: '28px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 4px' }}>{totale}</p>
                        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Totali</p>
                    </div>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', border: '0.5px solid #E8E0D0', textAlign: 'center' }}>
                        <p style={{ fontSize: '28px', fontWeight: 500, color: '#2D6A4F', margin: '0 0 4px' }}>{confermate}</p>
                        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Confermate</p>
                    </div>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', border: '0.5px solid #E8E0D0', textAlign: 'center' }}>
                        <p style={{ fontSize: '28px', fontWeight: 500, color: '#E85D04', margin: '0 0 4px' }}>{attesa}</p>
                        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>In attesa</p>
                    </div>
                </div>

                {/* MENU */}
                <div style={{ background: 'white', borderRadius: '16px', border: '0.5px solid #E8E0D0', overflow: 'hidden' }}>
                    <div onClick={() => navigate('/prenotazioni')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', cursor: 'pointer', borderBottom: '0.5px solid #F5F0E8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="ti ti-calendar-event" style={{ fontSize: '18px', color: '#2D6A4F' }} aria-hidden="true"></i>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A' }}>Le mie prenotazioni</span>
                        </div>
                        <i className="ti ti-chevron-right" style={{ fontSize: '16px', color: '#B4B2A9' }} aria-hidden="true"></i>
                    </div>

                    <div onClick={() => navigate('/notifiche')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', cursor: 'pointer', borderBottom: '0.5px solid #F5F0E8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="ti ti-bell" style={{ fontSize: '18px', color: '#E85D04' }} aria-hidden="true"></i>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A' }}>Notifiche</span>
                        </div>
                        <i className="ti ti-chevron-right" style={{ fontSize: '16px', color: '#B4B2A9' }} aria-hidden="true"></i>
                    </div>

                    {(utente.ruolo === 'gestore' || utente.ruolo === 'admin') && (
                        <div onClick={() => navigate('/gestore')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', cursor: 'pointer', borderBottom: '0.5px solid #F5F0E8' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="ti ti-settings" style={{ fontSize: '18px', color: '#2D6A4F' }} aria-hidden="true"></i>
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A' }}>Dashboard Gestore</span>
                            </div>
                            <i className="ti ti-chevron-right" style={{ fontSize: '16px', color: '#B4B2A9' }} aria-hidden="true"></i>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="ti ti-mail" style={{ fontSize: '18px', color: '#888780' }} aria-hidden="true"></i>
                            </div>
                            <span style={{ fontSize: '14px', color: '#1A1A1A' }}>{utente.email}</span>
                        </div>
                        <span style={{ background: bg, color, fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '100px' }}>{utente.ruolo}</span>
                    </div>
                </div>

                {/* LOGOUT */}
                <button onClick={handleLogout} style={{ width: '100%', background: 'white', border: '0.5px solid #FECACA', borderRadius: '14px', padding: '14px 0', color: '#C0392B', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginTop: '16px' }}>
                    Esci dall'account
                </button>
            </div>

            <div className="tabbar-mobile" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '0.5px solid #E8E0D0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '12px 0 20px', zIndex: 20 }}>
                <div onClick={() => navigate('/')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                    <i className="ti ti-home" style={{ fontSize: '22px', color: '#B4B2A9' }} aria-hidden="true"></i>
                    <span style={{ fontSize: '11px', color: '#B4B2A9' }}>Home</span>
                </div>
                <div onClick={() => navigate('/prenotazioni')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                    <i className="ti ti-calendar-event" style={{ fontSize: '22px', color: '#B4B2A9' }} aria-hidden="true"></i>
                    <span style={{ fontSize: '11px', color: '#B4B2A9' }}>Prenotazioni</span>
                </div>
                <div onClick={() => navigate('/notifiche')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                    <i className="ti ti-bell" style={{ fontSize: '22px', color: '#B4B2A9' }} aria-hidden="true"></i>
                    <span style={{ fontSize: '11px', color: '#B4B2A9' }}>Notifiche</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <i className="ti ti-user" style={{ fontSize: '22px', color: '#2D6A4F' }} aria-hidden="true"></i>
                    <span style={{ fontSize: '11px', color: '#2D6A4F', fontWeight: 500 }}>Profilo</span>
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

export default Profilo;