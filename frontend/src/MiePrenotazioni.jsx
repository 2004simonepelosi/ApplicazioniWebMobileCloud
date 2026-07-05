import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MiePrenotazioni() {
    const [prenotazioni, setPrenotazioni] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const utenteSalvato = localStorage.getItem('utente');
        if (!utenteSalvato) {
            navigate('/login');
            return;
        }

        const utente = JSON.parse(utenteSalvato);

        fetch(`http://localhost:3000/prenotazioni/utente/${utente.id}`)
            .then(risposta => risposta.json())
            .then(dati => {
                setPrenotazioni(dati);
                setCaricamento(false);
            });
    }, []);

    const handleCancella = async (idPrenotazione) => {
        const risposta = await fetch(`http://localhost:3000/prenotazioni/${idPrenotazione}/cancella`, {
            method: 'PUT'
        });

        if (risposta.ok) {
            setPrenotazioni(prev =>
                prev.map(p => p.id === idPrenotazione ? { ...p, stato: 'cancellata' } : p)
            );
        }
    };

    const coloreStato = (stato) => {
        if (stato === 'confermata') return '#97C459';
        if (stato === 'cancellata') return '#F09595';
        return '#FAC775';
    };

    if (caricamento) {
        return <p style={{ color: '#FAEEDA' }}>Caricamento...</p>;
    }

    return (
        <div style={styles.schermo}>
            <button onClick={() => navigate('/')} style={styles.bottoneIndietro}>← Indietro</button>
            <p style={styles.titolo}>Le mie prenotazioni</p>

            {prenotazioni.length === 0 ? (
                <p style={styles.vuoto}>Non hai ancora prenotazioni.</p>
            ) : (
                <div style={styles.lista}>
                    {prenotazioni.map((p) => (
                        <div key={p.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <p style={styles.nomeCampo}>{p.nome_campo}</p>
                                <span style={{ ...styles.stato, color: coloreStato(p.stato) }}>{p.stato}</span>
                            </div>
                            <p style={styles.dettagli}>{p.data} · {p.ora_inizio} - {p.ora_fine}</p>
                            <p style={styles.sport}>{p.sport}</p>
                            {p.stato !== 'cancellata' && (
                                <button onClick={() => handleCancella(p.id)} style={styles.bottoneCancella}>
                                    Cancella
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    schermo: {
        background: '#0F1115',
        borderRadius: '20px',
        padding: '24px',
        width: '100%',
        maxWidth: '420px',
        margin: '0 auto',
        minHeight: '600px',
        boxSizing: 'border-box'
    },
    bottoneIndietro: {
        background: 'none',
        border: 'none',
        color: '#FAEEDA',
        fontSize: '14px',
        cursor: 'pointer',
        padding: 0,
        marginBottom: '20px'
    },
    titolo: {
        color: '#FAEEDA',
        fontSize: '24px',
        fontWeight: 500,
        margin: '0 0 20px'
    },
    vuoto: {
        color: '#888780',
        fontSize: '14px',
        textAlign: 'center',
        marginTop: '40px'
    },
    lista: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    card: {
        background: '#1C1F26',
        borderRadius: '16px',
        padding: '16px'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '6px'
    },
    nomeCampo: {
        color: '#FAEEDA',
        fontSize: '15px',
        fontWeight: 500,
        margin: 0
    },
    stato: {
        fontSize: '12px',
        fontWeight: 500
    },
    dettagli: {
        color: '#888780',
        fontSize: '13px',
        margin: '0 0 4px'
    },
    sport: {
        color: '#888780',
        fontSize: '12px',
        margin: '0 0 12px'
    },
    bottoneCancella: {
        background: 'none',
        border: '1px solid #F09595',
        borderRadius: '8px',
        padding: '6px 14px',
        color: '#F09595',
        fontSize: '12px',
        cursor: 'pointer'
    }
};

export default MiePrenotazioni;