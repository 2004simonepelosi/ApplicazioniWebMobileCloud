import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const API = import.meta.env.VITE_API_URL;

function getBadgeBg(sport) {
    const s = sport?.toLowerCase();
    if (s === 'calcio') return '#D8F3DC';
    if (s === 'tennis') return '#F5E6D3';
    if (s === 'padel') return '#DBEAFE';
    if (s === 'basket') return '#FFEDD5';
    return '#F1EFE8';
}

function getBadgeColor(sport) {
    const s = sport?.toLowerCase();
    if (s === 'calcio') return '#1B4332';
    if (s === 'tennis') return '#6B3A1F';
    if (s === 'padel') return '#1E3A5F';
    if (s === 'basket') return '#C2410C';
    return '#5F5E5A';
}

function getCardBg(sport) {
    const s = sport?.toLowerCase();
    if (s === 'calcio') return '#2D6A4F';
    if (s === 'tennis') return '#8B5E3C';
    if (s === 'padel') return '#1E3A5F';
    if (s === 'basket') return '#E85D04';
    return '#888780';
}

function getSfondoFiltro(filtro) {
    if (filtro === 'calcio') return '#F0FDF4';
    if (filtro === 'tennis') return '#FDF6EE';
    if (filtro === 'padel') return '#EFF6FF';
    if (filtro === 'basket') return '#FFF7ED';
    return '#F5F0E8';
}

function Home() {
    const [campi, setCampi] = useState([]);
    const [campiFiltrati, setCampiFiltrati] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const [filtro, setFiltro] = useState('tutti');
    const [ricerca, setRicerca] = useState('');
    const [notifiche, setNotifiche] = useState([]);
    const [notificheAperte, setNotificheAperte] = useState(false);
    const [utente, setUtente] = useState(null);
    const [alertPrenotazione, setAlertPrenotazione] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const sports = ['tutti', 'calcio', 'tennis', 'padel', 'basket'];

    useEffect(() => {
        const u = localStorage.getItem('utente');
        if (u) {
            const utenteParsed = JSON.parse(u);
            setUtente(utenteParsed);
            if (utenteParsed.ruolo === 'admin') {
                navigate('/home-admin');
                return;
            }
            fetch(`${API}/notifiche/${utenteParsed.id}`)
                .then(r => r.json())
                .then(setNotifiche);
        }

        fetch(`${API}/campi`)
            .then(r => r.json())
            .then(dati => {
                setCampi(dati);
                setCampiFiltrati(dati);
                setCaricamento(false);
            });

        if (location.state?.prenotazioneEffettuata) {
            setAlertPrenotazione(location.state.nomeCampo);
            setTimeout(() => setAlertPrenotazione(null), 4000);
            window.history.replaceState({}, document.title);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setNotificheAperte(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        let risultati = campi;
        if (filtro !== 'tutti') {
            risultati = risultati.filter(c => c.sport?.toLowerCase() === filtro);
        }
        if (ricerca.trim()) {
            risultati = risultati.filter(c =>
                c.nome?.toLowerCase().includes(ricerca.toLowerCase()) ||
                c.sport?.toLowerCase().includes(ricerca.toLowerCase()) ||
                c.indirizzo?.toLowerCase().includes(ricerca.toLowerCase())
            );
        }
        setCampiFiltrati(risultati);
    }, [filtro, ricerca, campi]);

    const leggiTutte = async (e) => {
        e.stopPropagation();
        if (!utente) return;
        await fetch(`${API}/notifiche/leggi-tutte/${utente.id}`, { method: 'PUT' });
        setNotifiche(prev => prev.map(n => ({ ...n, letta: 1 })));
    };

    if (caricamento) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F5F0E8' }}>
            <p style={{ color: '#888780', fontSize: '14px' }}>Caricamento...</p>
        </div>
    );

    const sfondo = getSfondoFiltro(filtro);
    const nonLette = notifiche.filter(n => n.letta === 0).length;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: sfondo, fontFamily: 'var(--font-sans)', transition: 'background 0.3s ease' }}>
            <Sidebar />

            {alertPrenotazione && (
                <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#2D6A4F', borderRadius: '16px', padding: '16px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 999, display: 'flex', alignItems: 'center', gap: '12px', minWidth: '320px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="ti ti-circle-check" style={{ fontSize: '20px', color: 'white' }} aria-hidden="true"></i>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ color: 'white', fontWeight: 500, fontSize: '14px', margin: '0 0 2px' }}>Prenotazione effettuata!</p>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: 0 }}>{alertPrenotazione} è stato prenotato</p>
                    </div>
                    <button onClick={() => setAlertPrenotazione(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '20px', padding: 0, lineHeight: 1 }}>×</button>
                </div>
            )}

            <div className="main-content" style={{ marginLeft: '220px', flex: 1, padding: '28px', paddingBottom: '100px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <p style={{ fontSize: '12px', color: '#888780', margin: '0 0 2px', fontWeight: 500, letterSpacing: '0.5px' }}>
                            {new Date().toLocaleDateString('it-IT', { weekday: 'long' }).toUpperCase()}
                        </p>
                        <p style={{ fontSize: '24px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>Dove giochi oggi?</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {utente && (
                            <div ref={dropdownRef} style={{ position: 'relative' }}>
                                <div onClick={() => setNotificheAperte(!notificheAperte)} style={{ position: 'relative', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '10px', border: notificheAperte ? '0.5px solid #2D6A4F' : '0.5px solid #E8E0D0' }}>
                                    <i className="ti ti-bell" style={{ fontSize: '20px', color: notificheAperte ? '#2D6A4F' : '#888780', display: 'block' }} aria-hidden="true"></i>
                                    {nonLette > 0 && (
                                        <span style={{ position: 'absolute', top: '6px', right: '6px', width: '9px', height: '9px', borderRadius: '50%', background: '#2D6A4F', border: '2px solid white' }}></span>
                                    )}
                                </div>

                                {notificheAperte && (
                                    <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '320px', background: 'white', borderRadius: '16px', border: '0.5px solid #E8E0D0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '0.5px solid #E8E0D0' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>Notifiche</p>
                                            {nonLette > 0 && <button onClick={leggiTutte} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#2D6A4F', cursor: 'pointer', fontWeight: 500 }}>Segna tutte lette</button>}
                                        </div>
                                        <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                                            {notifiche.length === 0 ? (
                                                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                                                    <i className="ti ti-bell-off" style={{ fontSize: '32px', color: '#D3D1C7' }} aria-hidden="true"></i>
                                                    <p style={{ color: '#888780', fontSize: '13px', marginTop: '8px' }}>Nessuna notifica</p>
                                                </div>
                                            ) : (
                                                <>
                                                    {notifiche.map(n => (
                                                        <div key={n.id} onClick={() => { setNotificheAperte(false); navigate('/notifiche'); }} style={{ padding: '12px 16px', borderBottom: '0.5px solid #F5F0E8', background: n.letta ? 'white' : '#F8FFF9', display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                                                            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: n.letta ? 'transparent' : '#2D6A4F', flexShrink: 0, marginTop: '5px' }}></div>
                                                            <div>
                                                                <p style={{ fontSize: '13px', color: '#1A1A1A', margin: '0 0 3px', fontWeight: n.letta ? 400 : 500, lineHeight: 1.4 }}>{n.messaggio}</p>
                                                                <p style={{ fontSize: '11px', color: '#B4B2A9', margin: 0 }}>{n.data}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div onClick={() => { setNotificheAperte(false); navigate('/notifiche'); }} style={{ padding: '12px 16px', textAlign: 'center', cursor: 'pointer', color: '#2D6A4F', fontSize: '13px', fontWeight: 500 }}>
                                                        Vedi tutte le notifiche →
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', border: '0.5px solid #E8E0D0', width: '240px' }}>
                            <i className="ti ti-search" style={{ fontSize: '16px', color: '#888780' }} aria-hidden="true"></i>
                            <input type="text" placeholder="Cerca campo o sport..." value={ricerca} onChange={(e) => setRicerca(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '14px', color: '#1A1A1A', background: 'transparent', width: '100%' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {sports.map(s => (
                        <button key={s} onClick={() => setFiltro(s)} style={{ background: filtro === s ? getCardBg(s === 'tutti' ? null : s) : 'white', color: filtro === s ? 'white' : '#5F5E5A', fontSize: '13px', fontWeight: filtro === s ? 500 : 400, padding: '7px 18px', borderRadius: '100px', border: filtro === s ? 'none' : '0.5px solid #E8E0D0', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                            {s === 'tutti' ? 'Tutti' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>

                <p style={{ fontSize: '12px', fontWeight: 500, color: '#888780', margin: '0 0 14px', letterSpacing: '0.3px' }}>CAMPI DISPONIBILI</p>

                {campiFiltrati.length === 0 ? (
                    <p style={{ color: '#888780', fontSize: '14px' }}>Nessun campo trovato.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                        {campiFiltrati.map((campo) => {
                            const sport = campo.sport?.toLowerCase();
                            const isColorato = ['calcio', 'tennis', 'padel', 'basket'].includes(sport);
                            const cardBg = isColorato ? getCardBg(campo.sport) : 'white';
                            const testoColor = isColorato ? 'rgba(255,255,255,0.9)' : '#1A1A1A';
                            const dettagliColor = isColorato ? 'rgba(255,255,255,0.7)' : '#888780';
                            return (
                                <Link key={campo.id} to={`/campo/${campo.id}`} style={{ textDecoration: 'none' }}>
                                    <div style={{ background: cardBg, borderRadius: '20px', padding: '18px', border: isColorato ? 'none' : '0.5px solid #E8E0D0', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
                                        {isColorato && <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ background: isColorato ? 'rgba(255,255,255,0.2)' : getBadgeBg(campo.sport), color: isColorato ? 'white' : getBadgeColor(campo.sport), fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '100px', display: 'inline-block' }}>{campo.sport}</span>
                                                {campo.tipo_superficie && <span style={{ background: isColorato ? 'rgba(255,255,255,0.15)' : '#F1EFE8', color: isColorato ? 'rgba(255,255,255,0.85)' : '#5F5E5A', fontSize: '11px', padding: '3px 10px', borderRadius: '100px', display: 'inline-block' }}>{campo.tipo_superficie}</span>}
                                            </div>
                                            <i className="ti ti-heart" style={{ fontSize: '18px', color: isColorato ? 'rgba(255,255,255,0.5)' : '#D3D1C7' }} aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 500, fontSize: '15px', color: testoColor, margin: '12px 0 4px' }}>{campo.nome}</p>
                                            {campo.indirizzo && <p style={{ fontSize: '12px', color: dettagliColor, margin: '0 0 8px' }}><i className="ti ti-map-pin" style={{ fontSize: '13px', verticalAlign: '-1px' }} aria-hidden="true"></i> {campo.indirizzo}</p>}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '12px', color: dettagliColor }}>max {campo.max_giocatori} gioc.</span>
                                                <span style={{ fontWeight: 500, fontSize: '20px', color: testoColor }}>{campo.prezzo_ora}€<span style={{ fontSize: '12px', fontWeight: 400 }}>/h</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="tabbar-mobile" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '0.5px solid #E8E0D0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '12px 0 20px', zIndex: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <i className="ti ti-home" style={{ fontSize: '22px', color: '#2D6A4F' }} aria-hidden="true"></i>
                    <span style={{ fontSize: '11px', color: '#2D6A4F', fontWeight: 500 }}>Home</span>
                </div>
                {utente && (
                    <div onClick={() => navigate('/prenotazioni')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                        <i className="ti ti-calendar-event" style={{ fontSize: '22px', color: '#B4B2A9' }} aria-hidden="true"></i>
                        <span style={{ fontSize: '11px', color: '#B4B2A9' }}>Prenotazioni</span>
                    </div>
                )}
                {utente && (
                    <div onClick={() => navigate('/notifiche')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                        <div style={{ position: 'relative' }}>
                            <i className="ti ti-bell" style={{ fontSize: '22px', color: '#B4B2A9' }} aria-hidden="true"></i>
                            {nonLette > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', borderRadius: '50%', background: '#2D6A4F', border: '2px solid white' }}></span>}
                        </div>
                        <span style={{ fontSize: '11px', color: '#B4B2A9' }}>Notifiche</span>
                    </div>
                )}
                <div onClick={() => navigate(utente ? '/profilo' : '/login')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                    <i className="ti ti-user" style={{ fontSize: '22px', color: '#B4B2A9' }} aria-hidden="true"></i>
                    <span style={{ fontSize: '11px', color: '#B4B2A9' }}>{utente ? 'Profilo' : 'Accedi'}</span>
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

export default Home;