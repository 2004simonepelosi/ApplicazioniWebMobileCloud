import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardGestore() {
    const [campi, setCampi] = useState([]);
    const [prenotazioni, setPrenotazioni] = useState([]);
    const [utente, setUtente] = useState(null);
    const [caricamento, setCaricamento] = useState(true);
    const [nuovoCampo, setNuovoCampo] = useState(false);
    const [form, setForm] = useState({ nome: '', sport: '', indirizzo: '', prezzo_ora: '', max_giocatori: '', descrizione: '' });
    const [messaggio, setMessaggio] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const utenteSalvato = localStorage.getItem('utente');
        if (!utenteSalvato) { navigate('/login'); return; }

        const u = JSON.parse(utenteSalvato);
        if (u.ruolo !== 'gestore' && u.ruolo !== 'admin') { navigate('/'); return; }

        setUtente(u);

        fetch(`http://localhost:3000/campi/gestore/${u.id}`)
            .then(r => r.json())
            .then(dati => {
                setCampi(dati);
                const promises = dati.map(campo =>
                    fetch(`http://localhost:3000/prenotazioni/campo/${campo.id}`)
                        .then(r => r.json())
                );
                return Promise.all(promises);
            })
            .then(tuttePrenotazioni => {
                setPrenotazioni(tuttePrenotazioni.flat());
                setCaricamento(false);
            });
    }, []);

    const handleAggiungiCampo = async (e) => {
        e.preventDefault();
        const risposta = await fetch('http://localhost:3000/campi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, id_gestore: utente.id, prezzo_ora: parseFloat(form.prezzo_ora), max_giocatori: parseInt(form.max_giocatori) })
        });
        const dati = await risposta.json();
        if (!risposta.ok) { setMessaggio(dati.errore); return; }
        setMessaggio('Campo aggiunto!');
        setNuovoCampo(false);
        setForm({ nome: '', sport: '', indirizzo: '', prezzo_ora: '', max_giocatori: '', descrizione: '' });
        fetch(`http://localhost:3000/campi/gestore/${utente.id}`).then(r => r.json()).then(setCampi);
    };

    const handleConferma = async (idPrenotazione) => {
        await fetch(`http://localhost:3000/prenotazioni/${idPrenotazione}/conferma`, { method: 'PUT' });
        setPrenotazioni(prev => prev.map(p => p.id === idPrenotazione ? { ...p, stato: 'confermata' } : p));
    };

    const handleRifiuta = async (idPrenotazione) => {
        await fetch(`http://localhost:3000/prenotazioni/${idPrenotazione}/cancella`, { method: 'PUT' });
        setPrenotazioni(prev => prev.map(p => p.id === idPrenotazione ? { ...p, stato: 'cancellata' } : p));
    };

    if (caricamento) return <p style={{ color: '#FAEEDA' }}>Caricamento...</p>;

    return (
        <div style={styles.schermo}>
            <button onClick={() => navigate('/')} style={styles.bottoneIndietro}>← Indietro</button>
            <p style={styles.titolo}>Dashboard Gestore</p>

            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <p style={styles.statNumero}>{campi.length}</p>
                    <p style={styles.statLabel}>Campi</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statNumero}>{prenotazioni.filter(p => p.stato === 'in attesa').length}</p>
                    <p style={styles.statLabel}>Da confermare</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statNumero}>{prenotazioni.filter(p => p.stato === 'confermata').length}</p>
                    <p style={styles.statLabel}>Confermate</p>
                </div>
            </div>

            <div style={styles.sezioneHeader}>
                <p style={styles.sottotitolo}>I miei campi</p>
                <button onClick={() => setNuovoCampo(!nuovoCampo)} style={styles.bottoneAggiungi}>+ Aggiungi</button>
            </div>

            {nuovoCampo && (
                <form onSubmit={handleAggiungiCampo} style={styles.form}>
                    {['nome', 'sport', 'indirizzo', 'prezzo_ora', 'max_giocatori', 'descrizione'].map(campo => (
                        <input
                            key={campo}
                            placeholder={campo.replace('_', ' ')}
                            value={form[campo]}
                            onChange={(e) => setForm(prev => ({ ...prev, [campo]: e.target.value }))}
                            style={styles.input}
                        />
                    ))}
                    <button type="submit" style={styles.bottoneSalva}>Salva campo</button>
                </form>
            )}

            {messaggio && <p style={styles.messaggio}>{messaggio}</p>}

            <div style={styles.lista}>
                {campi.map(campo => (
                    <div key={campo.id} style={styles.card}>
                        <p style={styles.nomeCampo}>{campo.nome}</p>
                        <p style={styles.dettagli}>{campo.sport} · {campo.prezzo_ora}€/h</p>
                    </div>
                ))}
            </div>

            <p style={{ ...styles.sottotitolo, marginTop: '24px' }}>Prenotazioni ricevute</p>

            <div style={styles.lista}>
                {prenotazioni.length === 0 ? (
                    <p style={styles.vuoto}>Nessuna prenotazione ancora.</p>
                ) : (
                    prenotazioni.map(p => (
                        <div key={p.id} style={styles.cardPrenotazione}>
                            <div style={styles.cardHeader}>
                                <p style={styles.nomeUtente}>{p.nome} {p.cognome}</p>
                                <span style={{ fontSize: '12px', color: p.stato === 'confermata' ? '#97C459' : p.stato === 'cancellata' ? '#F09595' : '#FAC775' }}>
                  {p.stato}
                </span>
                            </div>
                            <p style={styles.dettagli}>{p.data} · {p.ora_inizio} - {p.ora_fine}</p>
                            {p.stato === 'in attesa' && (
                                <div style={styles.azioni}>
                                    <button onClick={() => handleConferma(p.id)} style={styles.bottoneConferma}>✓ Conferma</button>
                                    <button onClick={() => handleRifiuta(p.id)} style={styles.bottoneRifiuta}>✗ Rifiuta</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
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
    sezioneHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    sottotitolo: { color: '#FAEEDA', fontSize: '16px', fontWeight: 500, margin: 0 },
    bottoneAggiungi: { background: '#FAC775', border: 'none', borderRadius: '10px', padding: '6px 14px', color: '#412402', fontWeight: 500, fontSize: '13px', cursor: 'pointer' },
    form: { background: '#1C1F26', borderRadius: '16px', padding: '16px', marginBottom: '16px' },
    input: { width: '100%', background: '#0F1115', border: 'none', borderRadius: '10px', padding: '10px 14px', marginBottom: '8px', color: '#FAEEDA', fontSize: '14px', boxSizing: 'border-box' },
    bottoneSalva: { width: '100%', background: '#FAC775', border: 'none', borderRadius: '10px', padding: '12px 0', color: '#412402', fontWeight: 500, fontSize: '14px', cursor: 'pointer' },
    messaggio: { color: '#97C459', fontSize: '13px', marginBottom: '12px' },
    lista: { display: 'flex', flexDirection: 'column', gap: '10px' },
    card: { background: '#1C1F26', borderRadius: '14px', padding: '14px' },
    nomeCampo: { color: '#FAEEDA', fontSize: '15px', fontWeight: 500, margin: '0 0 4px' },
    dettagli: { color: '#888780', fontSize: '13px', margin: 0 },
    vuoto: { color: '#888780', fontSize: '14px', textAlign: 'center', marginTop: '20px' },
    cardPrenotazione: { background: '#1C1F26', borderRadius: '14px', padding: '14px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
    nomeUtente: { color: '#FAEEDA', fontSize: '14px', fontWeight: 500, margin: 0 },
    azioni: { display: 'flex', gap: '8px', marginTop: '10px' },
    bottoneConferma: { flex: 1, background: 'rgba(151, 196, 89, 0.15)', border: '1px solid #97C459', borderRadius: '8px', padding: '8px 0', color: '#97C459', fontSize: '13px', cursor: 'pointer' },
    bottoneRifiuta: { flex: 1, background: 'rgba(240, 149, 149, 0.15)', border: '1px solid #F09595', borderRadius: '8px', padding: '8px 0', color: '#F09595', fontSize: '13px', cursor: 'pointer' }
};

export default DashboardGestore;