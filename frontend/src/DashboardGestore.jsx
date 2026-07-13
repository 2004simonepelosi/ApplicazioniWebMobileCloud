import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const API = import.meta.env.VITE_API_URL;

const SUPERFICI = {
    tennis: ['Terra battuta', 'Cemento', 'Erba sintetica'],
    padel: ['Indoor', 'Outdoor'],
    calcio: ['Erba naturale', 'Erba sintetica', 'Cemento'],
    basket: ['Parquet', 'Cemento', 'Outdoor'],
};

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

function DashboardGestore() {
    const [campi, setCampi] = useState([]);
    const [prenotazioni, setPrenotazioni] = useState([]);
    const [utente, setUtente] = useState(null);
    const [caricamento, setCaricamento] = useState(true);
    const [nuovoCampo, setNuovoCampo] = useState(false);
    const [form, setForm] = useState({ nome: '', sport: '', tipo_superficie: '', indirizzo: '', prezzo_ora: '', max_giocatori: '', descrizione: '' });
    const [messaggio, setMessaggio] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const utenteSalvato = localStorage.getItem('utente');
        if (!utenteSalvato) { navigate('/login'); return; }
        const u = JSON.parse(utenteSalvato);
        if (u.ruolo !== 'gestore' && u.ruolo !== 'admin') { navigate('/'); return; }
        setUtente(u);

        fetch(`${API}/campi/gestore/${u.id}`)
            .then(r => r.json())
            .then(dati => {
                setCampi(dati);
                const promises = dati.map(campo =>
                    fetch(`${API}/prenotazioni/campo/${campo.id}`).then(r => r.json())
                );
                return Promise.all(promises);
            })
            .then(tuttePrenotazioni => {
                setPrenotazioni(tuttePrenotazioni.flat());
                setCaricamento(false);
            });
    }, []);

    const handleSportChange = (sport) => {
        setForm(prev => ({ ...prev, sport, tipo_superficie: '' }));
    };

    const handleAggiungiCampo = async (e) => {
        e.preventDefault();
        const risposta = await fetch(`${API}/campi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                id_gestore: utente.id,
                prezzo_ora: parseFloat(form.prezzo_ora),
                max_giocatori: parseInt(form.max_giocatori)
            })
        });
        const dati = await risposta.json();
        if (!risposta.ok) { setMessaggio(dati.errore); return; }
        setMessaggio('Campo aggiunto!');
        setNuovoCampo(false);
        setForm({ nome: '', sport: '', tipo_superficie: '', indirizzo: '', prezzo_ora: '', max_giocatori: '', descrizione: '' });
        fetch(`${API}/campi/gestore/${utente.id}`).then(r => r.json()).then(setCampi);
    };

    const handleConferma = async (idPrenotazione) => {
        await fetch(`${API}/prenotazioni/${idPrenotazione}/conferma`, { method: 'PUT' });
        setPrenotazioni(prev => prev.map(p => p.id === idPrenotazione ? { ...p, stato: 'confermata' } : p));
    };

    const handleRifiuta = async (idPrenotazione) => {
        await fetch(`${API}/prenotazioni/${idPrenotazione}/cancella`, { method: 'PUT' });
        setPrenotazioni(prev => prev.map(p => p.id === idPrenotazione ? { ...p, stato: 'cancellata' } : p));
    };

    const superficiDisponibili = SUPERFICI[form.sport?.toLowerCase()] || [];

    if (caricamento) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F5F0E8' }}>
            <p style={{ color: '#888780', fontSize: '14px' }}>Caricamento...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>
            <Sidebar />

            <div className="main-content" style={{ marginLeft: '220px', flex: 1, padding: '28px', paddingBottom: '100px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <p style={{ fontSize: '12px', color: '#888780', margin: '0 0 2px', fontWeight: 500, letterSpacing: '0.5px' }}>DASHBOARD</p>
                        <p style={{ fontSize: '24px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>I tuoi campi</p>
                    </div>
                    <button onClick={() => setNuovoCampo(!nuovoCampo)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#2D6A4F', border: 'none', borderRadius: '10px', padding: '10px 18px', color: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                        + Aggiungi campo
                    </button>
                </div>

                {/* STATISTICHE */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '0.5px solid #E8E0D0' }}>
                        <p style={{ fontSize: '28px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 4px' }}>{campi.length}</p>
                        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Campi totali</p>
                    </div>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '0.5px solid #E8E0D0' }}>
                        <p style={{ fontSize: '28px', fontWeight: 500, color: '#E85D04', margin: '0 0 4px' }}>{prenotazioni.filter(p => p.stato === 'in attesa').length}</p>
                        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Da confermare</p>
                    </div>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '0.5px solid #E8E0D0' }}>
                        <p style={{ fontSize: '28px', fontWeight: 500, color: '#2D6A4F', margin: '0 0 4px' }}>{prenotazioni.filter(p => p.stato === 'confermata').length}</p>
                        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Confermate</p>
                    </div>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '0.5px solid #E8E0D0' }}>
                        <p style={{ fontSize: '28px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 4px' }}>{prenotazioni.length}</p>
                        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Totali</p>
                    </div>
                </div>

                {/* FORM NUOVO CAMPO */}
                {nuovoCampo && (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '0.5px solid #E8E0D0' }}>
                        <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 16px' }}>Nuovo campo</p>
                        <form onSubmit={handleAggiungiCampo}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '6px' }}>Nome campo</label>
                                    <input placeholder="Es. Campo Centrale A" value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '6px' }}>Sport</label>
                                    <select value={form.sport} onChange={e => handleSportChange(e.target.value)} style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }}>
                                        <option value="">Seleziona sport</option>
                                        <option value="calcio">Calcio</option>
                                        <option value="tennis">Tennis</option>
                                        <option value="padel">Padel</option>
                                        <option value="basket">Basket</option>
                                    </select>
                                </div>
                                {superficiDisponibili.length > 0 && (
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '6px' }}>
                                            {form.sport === 'padel' ? 'Tipo (Indoor/Outdoor)' : 'Tipo superficie'}
                                        </label>
                                        <select value={form.tipo_superficie} onChange={e => setForm(p => ({ ...p, tipo_superficie: e.target.value }))} style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }}>
                                            <option value="">Seleziona tipo</option>
                                            {superficiDisponibili.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '6px' }}>Indirizzo</label>
                                    <input placeholder="Via Roma, 1" value={form.indirizzo} onChange={e => setForm(p => ({ ...p, indirizzo: e.target.value }))} style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '6px' }}>Prezzo/ora (€)</label>
                                    <input type="number" placeholder="25" value={form.prezzo_ora} onChange={e => setForm(p => ({ ...p, prezzo_ora: e.target.value }))} style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '6px' }}>Max giocatori</label>
                                    <input type="number" placeholder="10" value={form.max_giocatori} onChange={e => setForm(p => ({ ...p, max_giocatori: e.target.value }))} style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '6px' }}>Descrizione</label>
                                    <input placeholder="Descrizione del campo..." value={form.descrizione} onChange={e => setForm(p => ({ ...p, descrizione: e.target.value }))} style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                            </div>
                            <button type="submit" style={{ background: '#2D6A4F', border: 'none', borderRadius: '10px', padding: '12px 24px', color: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Salva campo</button>
                        </form>
                    </div>
                )}

                {messaggio && <p style={{ color: '#2D6A4F', fontSize: '13px', marginBottom: '16px', fontWeight: 500 }}>{messaggio}</p>}

                {/* LISTA CAMPI */}
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#888780', margin: '0 0 12px', letterSpacing: '0.3px' }}>I MIEI CAMPI</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '28px' }}>
                    {campi.map(campo => (
                        <div key={campo.id} style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '0.5px solid #E8E0D0' }}>
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                <span style={{ background: getBadgeBg(campo.sport), color: getBadgeColor(campo.sport), fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '100px' }}>{campo.sport}</span>
                                {campo.tipo_superficie && <span style={{ background: '#F5F0E8', color: '#888780', fontSize: '11px', padding: '3px 10px', borderRadius: '100px' }}>{campo.tipo_superficie}</span>}
                            </div>
                            <p style={{ fontSize: '15px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 4px' }}>{campo.nome}</p>
                            <p style={{ fontSize: '12px', color: '#888780', margin: '0 0 8px' }}>{campo.indirizzo}</p>
                            <p style={{ fontSize: '16px', fontWeight: 500, color: '#2D6A4F', margin: 0 }}>{campo.prezzo_ora}€/h</p>
                        </div>
                    ))}
                </div>

                {/* PRENOTAZIONI */}
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#888780', margin: '0 0 12px', letterSpacing: '0.3px' }}>PRENOTAZIONI RICEVUTE</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {prenotazioni.length === 0 ? (
                        <p style={{ color: '#888780', fontSize: '14px' }}>Nessuna prenotazione ancora.</p>
                    ) : (
                        prenotazioni.map(p => (
                            <div key={p.id} style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '0.5px solid #E8E0D0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 2px' }}>{p.nome} {p.cognome}</p>
                                        <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>{p.data} · {p.ora_inizio} - {p.ora_fine}</p>
                                    </div>
                                    <span style={{ fontSize: '12px', fontWeight: 500, color: p.stato === 'confermata' ? '#2D6A4F' : p.stato === 'cancellata' ? '#C0392B' : '#E85D04' }}>
                    {p.stato}
                  </span>
                                </div>
                                {p.stato === 'in attesa' && (
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                        <button onClick={() => handleConferma(p.id)} style={{ flex: 1, background: '#F0FDF4', border: '0.5px solid #2D6A4F', borderRadius: '8px', padding: '8px 0', color: '#2D6A4F', fontSize: '13px', cursor: 'pointer' }}>✓ Conferma</button>
                                        <button onClick={() => handleRifiuta(p.id)} style={{ flex: 1, background: '#FEF2F2', border: '0.5px solid #C0392B', borderRadius: '8px', padding: '8px 0', color: '#C0392B', fontSize: '13px', cursor: 'pointer' }}>✗ Rifiuta</button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* TAB BAR MOBILE */}
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

export default DashboardGestore;