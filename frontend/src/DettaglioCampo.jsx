import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const API = import.meta.env.VITE_API_URL;

function getColoreSport(sport) {
    const s = sport?.toLowerCase();
    if (s === 'calcio') return { bg: '#2D6A4F', light: '#F0FDF4', border: '#B7E4C7' };
    if (s === 'tennis') return { bg: '#8B5E3C', light: '#FDF6EE', border: '#F5D5B8' };
    if (s === 'padel') return { bg: '#1E3A5F', light: '#EFF6FF', border: '#BFDBFE' };
    if (s === 'basket') return { bg: '#E85D04', light: '#FFF7ED', border: '#FED7AA' };
    return { bg: '#888780', light: '#F5F0E8', border: '#E8E0D0' };
}

const SLOT_ORARI = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00'
];

function DettaglioCampo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campo, setCampo] = useState(null);
    const [caricamento, setCaricamento] = useState(true);
    const [data, setData] = useState('');
    const [slotSelezionato, setSlotSelezionato] = useState(null);
    const [orariOccupati, setOrariOccupati] = useState([]);
    const [messaggio, setMessaggio] = useState('');
    const [successo, setSuccesso] = useState(false);

    const oggi = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetch(`${API}/campi/${id}`)
            .then(r => r.json())
            .then(dati => { setCampo(dati); setCaricamento(false); });
    }, [id]);

    useEffect(() => {
        if (!data) return;
        setSlotSelezionato(null);
        fetch(`${API}/prenotazioni/orari-occupati/${id}/${data}`)
            .then(r => r.json())
            .then(setOrariOccupati);
    }, [data, id]);

    const isOccupato = (slot) => {
        return orariOccupati.some(p => slot >= p.ora_inizio && slot < p.ora_fine);
    };

    const oraFineSlot = (slot) => {
        const [h, m] = slot.split(':').map(Number);
        const fine = h + 1;
        return `${String(fine).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const handlePrenota = async () => {
        const utenteSalvato = localStorage.getItem('utente');
        if (!utenteSalvato) {
            navigate('/login', { state: { tornaA: `/campo/${id}` } });
            return;
        }
        if (!data || !slotSelezionato) {
            setMessaggio('Seleziona data e orario');
            setSuccesso(false);
            return;
        }
        const utente = JSON.parse(utenteSalvato);
        const risposta = await fetch(`${API}/prenotazioni`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_utente: utente.id,
                id_campo: id,
                data,
                ora_inizio: slotSelezionato,
                ora_fine: oraFineSlot(slotSelezionato)
            })
        });
        const risultato = await risposta.json();
        if (!risposta.ok) {
            setMessaggio(risultato.errore);
            setSuccesso(false);
            return;
        }
        navigate('/', { state: { prenotazioneEffettuata: true, nomeCampo: campo.nome } });
    };

    if (caricamento) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F5F0E8' }}>
            <p style={{ color: '#888780', fontSize: '14px' }}>Caricamento...</p>
        </div>
    );

    const colori = getColoreSport(campo.sport);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: colori.light, fontFamily: 'var(--font-sans)' }}>
            <Sidebar />

            <div className="main-content" style={{ marginLeft: '220px', flex: 1, padding: '28px', paddingBottom: '100px' }}>

                {/* HEADER */}
                <div style={{ background: colori.bg, borderRadius: '24px', padding: '28px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}></div>
                    <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}></div>
                    <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', padding: '6px 14px', color: 'white', fontSize: '13px', cursor: 'pointer', marginBottom: '20px' }}>
                        ← Indietro
                    </button>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '100px' }}>{campo.sport}</span>
                                {campo.tipo_superficie && <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', padding: '4px 12px', borderRadius: '100px' }}>{campo.tipo_superficie}</span>}
                            </div>
                            <p style={{ fontSize: '28px', fontWeight: 500, color: 'white', margin: '0 0 6px' }}>{campo.nome}</p>
                            {campo.indirizzo && <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 4px' }}>📍 {campo.indirizzo}</p>}
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>👥 max {campo.max_giocatori} giocatori</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '40px', fontWeight: 500, color: 'white', margin: 0, lineHeight: 1 }}>{campo.prezzo_ora}€</p>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0' }}>all'ora</p>
                        </div>
                    </div>
                </div>

                {campo.descrizione && (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '0.5px solid #E8E0D0' }}>
                        <p style={{ fontSize: '12px', fontWeight: 500, color: '#888780', margin: '0 0 8px', letterSpacing: '0.3px' }}>DESCRIZIONE</p>
                        <p style={{ fontSize: '14px', color: '#1A1A1A', margin: 0, lineHeight: 1.6 }}>{campo.descrizione}</p>
                    </div>
                )}

                {/* FORM PRENOTAZIONE */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '0.5px solid #E8E0D0' }}>
                    <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', margin: '0 0 20px' }}>Prenota questo campo</p>

                    {/* DATA */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>SCEGLI LA DATA</label>
                        <input
                            type="date"
                            value={data}
                            min={oggi}
                            onChange={e => setData(e.target.value)}
                            style={{ width: '100%', background: '#F5F0E8', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* GRIGLIA SLOT ORARI */}
                    {data && (
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 500, color: '#888780', letterSpacing: '0.3px' }}>SCEGLI L'ORARIO</label>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: colori.bg }}></div>
                                        <span style={{ fontSize: '11px', color: '#888780' }}>Selezionato</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#FEF2F2', border: '0.5px solid #FECACA' }}></div>
                                        <span style={{ fontSize: '11px', color: '#888780' }}>Occupato</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#F5F0E8', border: '0.5px solid #E8E0D0' }}></div>
                                        <span style={{ fontSize: '11px', color: '#888780' }}>Disponibile</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                                {SLOT_ORARI.map(slot => {
                                    const occupato = isOccupato(slot);
                                    const selezionato = slotSelezionato === slot;

                                    return (
                                        <button
                                            key={slot}
                                            disabled={occupato}
                                            onClick={() => !occupato && setSlotSelezionato(slot)}
                                            style={{
                                                padding: '10px 6px',
                                                borderRadius: '10px',
                                                border: selezionato ? 'none' : occupato ? '0.5px solid #FECACA' : '0.5px solid #E8E0D0',
                                                background: selezionato ? colori.bg : occupato ? '#FEF2F2' : '#F5F0E8',
                                                color: selezionato ? 'white' : occupato ? '#C0392B' : '#1A1A1A',
                                                fontSize: '13px',
                                                fontWeight: selezionato ? 500 : 400,
                                                cursor: occupato ? 'not-allowed' : 'pointer',
                                                textDecoration: occupato ? 'line-through' : 'none',
                                                opacity: occupato ? 0.7 : 1,
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            {slot}
                                        </button>
                                    );
                                })}
                            </div>

                            {slotSelezionato && (
                                <div style={{ marginTop: '12px', background: colori.light, borderRadius: '10px', padding: '10px 14px', border: `0.5px solid ${colori.border}` }}>
                                    <p style={{ fontSize: '13px', color: '#1A1A1A', margin: 0 }}>
                                        ✅ Selezionato: <strong>{slotSelezionato} - {oraFineSlot(slotSelezionato)}</strong> (1 ora)
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* PREZZO E PRENOTA */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '0.5px solid #E8E0D0', paddingTop: '20px' }}>
                        <div>
                            <p style={{ fontSize: '12px', color: '#888780', margin: '0 0 2px' }}>Totale</p>
                            <p style={{ fontSize: '24px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>{campo.prezzo_ora}€</p>
                        </div>
                        <button
                            onClick={handlePrenota}
                            disabled={!data || !slotSelezionato}
                            style={{
                                background: data && slotSelezionato ? colori.bg : '#E8E0D0',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '14px 32px',
                                color: data && slotSelezionato ? 'white' : '#B4B2A9',
                                fontSize: '15px',
                                fontWeight: 500,
                                cursor: data && slotSelezionato ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Prenota
                        </button>
                    </div>

                    {messaggio && (
                        <div style={{ marginTop: '16px', background: '#FEF2F2', borderRadius: '10px', padding: '12px 16px', border: '0.5px solid #FECACA' }}>
                            <p style={{ color: '#C0392B', fontSize: '14px', fontWeight: 500, margin: 0 }}>⚠️ {messaggio}</p>
                        </div>
                    )}
                </div>
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

export default DettaglioCampo;