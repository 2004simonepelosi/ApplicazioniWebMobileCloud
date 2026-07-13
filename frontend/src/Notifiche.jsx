import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const API = import.meta.env.VITE_API_URL;

function getTipoNotifica(messaggio) {
    if (messaggio.includes('✅') || messaggio.includes('confermata')) return 'confermata';
    if (messaggio.includes('❌') || messaggio.includes('rifiutata')) return 'rifiutata';
    return 'attesa';
}

function getIconaNotifica(tipo) {
    if (tipo === 'confermata') return 'ti-circle-check';
    if (tipo === 'rifiutata') return 'ti-circle-x';
    return 'ti-clock';
}

function getColoriNotifica(tipo) {
    if (tipo === 'confermata') return { bg: '#F0FDF4', border: '#B7E4C7', icon: '#2D6A4F', testo: '#1B4332', label: '#2D6A4F' };
    if (tipo === 'rifiutata') return { bg: '#FEF2F2', border: '#FECACA', icon: '#C0392B', testo: '#7F1D1D', label: '#C0392B' };
    return { bg: '#FFF7ED', border: '#FED7AA', icon: '#E85D04', testo: '#7C2D12', label: '#E85D04' };
}

function getLabelNotifica(tipo) {
    if (tipo === 'confermata') return 'Confermata';
    if (tipo === 'rifiutata') return 'Rifiutata';
    return 'In attesa';
}

function pulisciMessaggio(messaggio) {
    return messaggio.replace('✅', '').replace('❌', '').trim();
}

function Notifiche() {
    const [notifiche, setNotifiche] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const [utente, setUtente] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const utenteSalvato = localStorage.getItem('utente');
        if (!utenteSalvato) { navigate('/login'); return; }
        const u = JSON.parse(utenteSalvato);
        setUtente(u);

        fetch(`${API}/notifiche/${u.id}`)
            .then(r => r.json())
            .then(dati => {
                setNotifiche(dati);
                setCaricamento(false);
            });
    }, []);

    const leggiTutte = async () => {
        if (!utente) return;
        await fetch(`${API}/notifiche/leggi-tutte/${utente.id}`, { method: 'PUT' });
        setNotifiche(prev => prev.map(n => ({ ...n, letta: 1 })));
    };

    const nonLette = notifiche.filter(n => n.letta === 0).length;

    if (caricamento) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F5F0E8' }}>
            <p style={{ color: '#888780', fontSize: '14px' }}>Caricamento...</p>
        </div>
    );

    const nonLetteList = notifiche.filter(n => n.letta === 0);
    const letteList = notifiche.filter(n => n.letta === 1);

    const CardNotifica = ({ n, evidenziata }) => {
        const tipo = getTipoNotifica(n.messaggio);
        const { bg, border, icon, label } = getColoriNotifica(tipo);

        return (
            <div style={{
                background: evidenziata ? bg : 'white',
                borderRadius: '16px',
                padding: '16px 20px',
                border: evidenziata ? `0.5px solid ${border}` : '0.5px solid #E8E0D0',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start'
            }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: evidenziata ? 'white' : bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`ti ${getIconaNotifica(tipo)}`} style={{ fontSize: '20px', color: icon }} aria-hidden="true"></i>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ background: evidenziata ? 'white' : bg, color: label, fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '100px', border: `0.5px solid ${border}` }}>
              {getLabelNotifica(tipo)}
            </span>
                        <span style={{ fontSize: '11px', color: '#B4B2A9' }}>{n.data}</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#1A1A1A', margin: 0, fontWeight: evidenziata ? 500 : 400, lineHeight: 1.5 }}>
                        {pulisciMessaggio(n.messaggio)}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
            <Sidebar />

            <div className="main-content" style={{ marginLeft: '220px', flex: 1, padding: '28px', paddingBottom: '100px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div>
                        <p style={{ fontSize: '12px', color: '#888780', margin: '0 0 2px', fontWeight: 500, letterSpacing: '0.5px' }}>IL TUO</p>
                        <p style={{ fontSize: '24px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>Centro notifiche</p>
                    </div>
                    {nonLette > 0 && (
                        <button onClick={leggiTutte} style={{ background: 'white', border: '0.5px solid #E8E0D0', borderRadius: '10px', padding: '8px 16px', color: '#2D6A4F', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                            Segna tutte come lette
                        </button>
                    )}
                </div>

                {/* STATISTICHE */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', border: '0.5px solid #E8E0D0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="ti ti-bell" style={{ fontSize: '20px', color: '#E85D04' }} aria-hidden="true"></i>
                        </div>
                        <div>
                            <p style={{ fontSize: '22px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>{notifiche.length}</p>
                            <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Totali</p>
                        </div>
                    </div>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', border: '0.5px solid #E8E0D0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="ti ti-bell-ringing" style={{ fontSize: '20px', color: '#2D6A4F' }} aria-hidden="true"></i>
                        </div>
                        <div>
                            <p style={{ fontSize: '22px', fontWeight: 500, color: '#2D6A4F', margin: 0 }}>{nonLette}</p>
                            <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Non lette</p>
                        </div>
                    </div>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '16px 20px', border: '0.5px solid #E8E0D0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="ti ti-circle-check" style={{ fontSize: '20px', color: '#2D6A4F' }} aria-hidden="true"></i>
                        </div>
                        <div>
                            <p style={{ fontSize: '22px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>{notifiche.filter(n => getTipoNotifica(n.messaggio) === 'confermata').length}</p>
                            <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Confermate</p>
                        </div>
                    </div>
                </div>

                {notifiche.length === 0 ? (
                    <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', border: '0.5px solid #E8E0D0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <i className="ti ti-bell-off" style={{ fontSize: '36px', color: '#D3D1C7' }} aria-hidden="true"></i>
                        </div>
                        <p style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: 500, margin: '0 0 6px' }}>Nessuna notifica</p>
                        <p style={{ color: '#888780', fontSize: '14px', margin: 0 }}>Le tue notifiche appariranno qui</p>
                    </div>
                ) : (
                    <>
                        {nonLetteList.length > 0 && (
                            <>
                                <p style={{ fontSize: '12px', fontWeight: 500, color: '#888780', margin: '0 0 12px', letterSpacing: '0.3px' }}>NON LETTE</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                                    {nonLetteList.map(n => <CardNotifica key={n.id} n={n} evidenziata={true} />)}
                                </div>
                            </>
                        )}

                        {letteList.length > 0 && (
                            <>
                                <p style={{ fontSize: '12px', fontWeight: 500, color: '#888780', margin: '0 0 12px', letterSpacing: '0.3px' }}>PRECEDENTI</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {letteList.map(n => <CardNotifica key={n.id} n={n} evidenziata={false} />)}
                                </div>
                            </>
                        )}
                    </>
                )}
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <i className="ti ti-bell" style={{ fontSize: '22px', color: '#2D6A4F' }} aria-hidden="true"></i>
                    <span style={{ fontSize: '11px', color: '#2D6A4F', fontWeight: 500 }}>Notifiche</span>
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

export default Notifiche;