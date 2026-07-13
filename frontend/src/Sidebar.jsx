import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [utente, setUtente] = useState(null);

    useEffect(() => {
        const u = localStorage.getItem('utente');
        if (u) setUtente(JSON.parse(u));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('utente');
        navigate('/');
        window.location.reload();
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/' || location.pathname === '/home-admin';
        return location.pathname === path;
    };

    const iniziali = utente ? utente.nome[0] + (utente.cognome?.[0] || '') : '';

    const navItem = (path, icon, label) => (
        <div onClick={() => navigate(path)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: isActive(path) ? '#F0FDF4' : 'transparent', borderRadius: '10px', cursor: 'pointer' }}>
            <i className={`ti ${icon}`} style={{ fontSize: '18px', color: isActive(path) ? '#2D6A4F' : '#888780' }} aria-hidden="true"></i>
            <span style={{ fontSize: '14px', fontWeight: isActive(path) ? 500 : 400, color: isActive(path) ? '#2D6A4F' : '#888780' }}>{label}</span>
        </div>
    );

    const homeRoute = utente?.ruolo === 'admin' ? '/home-admin' : '/';

    return (
        <div className="sidebar-desktop" style={{ width: '220px', background: 'white', borderRight: '0.5px solid #E8E0D0', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}>
            <p style={{ fontSize: '18px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 32px', cursor: 'pointer' }} onClick={() => navigate(homeRoute)}>SportBooking</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                {navItem(homeRoute, 'ti-home', 'Home')}
                {utente && utente.ruolo !== 'admin' && navItem('/prenotazioni', 'ti-calendar-event', 'Prenotazioni')}
                {utente && utente.ruolo !== 'admin' && navItem('/notifiche', 'ti-bell', 'Notifiche')}
                {utente && (utente.ruolo === 'gestore' || utente.ruolo === 'admin') && navItem('/gestore', 'ti-settings', 'Gestione')}
                {utente && utente.ruolo === 'admin' && navItem('/admin', 'ti-crown', 'Admin')}
            </div>

            <div style={{ borderTop: '0.5px solid #E8E0D0', paddingTop: '16px' }}>
                {utente ? (
                    <div>
                        <div onClick={() => navigate('/profilo')} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2D6A4F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 500, color: 'white', flexShrink: 0 }}>{iniziali.toUpperCase()}</div>
                            <div>
                                <p style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>{utente.nome}</p>
                                <p style={{ fontSize: '11px', color: '#888780', margin: 0 }}>{utente.ruolo}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} style={{ width: '100%', background: 'none', border: '0.5px solid #E8E0D0', borderRadius: '8px', padding: '7px 0', color: '#E24B4A', fontSize: '13px', cursor: 'pointer' }}>Esci</button>
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} style={{ width: '100%', background: '#2D6A4F', border: 'none', borderRadius: '10px', padding: '10px 0', color: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Accedi</button>
                )}
            </div>
        </div>
    );
}

export default Sidebar;