import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DettaglioCampo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campo, setCampo] = useState(null);
    const [caricamento, setCaricamento] = useState(true);
    const [data, setData] = useState('');
    const [oraInizio, setOraInizio] = useState('');
    const [oraFine, setOraFine] = useState('');
    const [messaggio, setMessaggio] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3000/campi/${id}`)
            .then(risposta => risposta.json())
            .then(dati => {
                setCampo(dati);
                setCaricamento(false);
            });
    }, [id]);

    const handlePrenota = async () => {
        const utenteSalvato = localStorage.getItem('utente');

        if (!utenteSalvato) {
            navigate('/login', { state: { tornaA: `/campo/${id}` } });
            return;
        }

        if (!data || !oraInizio || !oraFine) {
            setMessaggio('Compila data e orario');
            return;
        }

        const utente = JSON.parse(utenteSalvato);

        const risposta = await fetch('http://localhost:3000/prenotazioni', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_utente: utente.id,
                id_campo: id,
                data,
                ora_inizio: oraInizio,
                ora_fine: oraFine
            })
        });

        const risultato = await risposta.json();

        if (!risposta.ok) {
            setMessaggio(risultato.errore);
            return;
        }

        setMessaggio('Prenotazione effettuata!');
    };

    if (caricamento) {
        return <p style={{ color: '#FAEEDA' }}>Caricamento...</p>;
    }

    return (
        <div style={styles.schermo}>
            <button onClick={() => navigate('/')} style={styles.bottoneIndietro}>← Indietro</button>

            <div style={styles.header}>
                <p style={styles.nomeCampo}>{campo.nome}</p>
                <p style={styles.indirizzo}>{campo.indirizzo}</p>
                <p style={styles.sport}>{campo.sport} · max {campo.max_giocatori} giocatori</p>
            </div>

            {campo.descrizione && <p style={styles.descrizione}>{campo.descrizione}</p>}

            <label style={styles.label}>DATA</label>
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={styles.input} />

            <div style={styles.rigaDoppia}>
                <div style={styles.colonna}>
                    <label style={styles.label}>DALLE</label>
                    <input type="time" value={oraInizio} onChange={(e) => setOraInizio(e.target.value)} style={styles.input} />
                </div>
                <div style={styles.colonna}>
                    <label style={styles.label}>ALLE</label>
                    <input type="time" value={oraFine} onChange={(e) => setOraFine(e.target.value)} style={styles.input} />
                </div>
            </div>

            <div style={styles.prezzoBox}>
                <div>
                    <p style={styles.etichettaPrezzo}>Prezzo</p>
                    <p style={styles.prezzo}>{campo.prezzo_ora}€<span style={styles.unita}>/h</span></p>
                </div>
                <button onClick={handlePrenota} style={styles.bottonePrenota}>Prenota</button>
            </div>

            {messaggio && <p style={styles.messaggio}>{messaggio}</p>}
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
    header: {
        marginBottom: '16px'
    },
    nomeCampo: {
        color: '#FAEEDA',
        fontSize: '22px',
        fontWeight: 500,
        margin: '0 0 4px'
    },
    indirizzo: {
        color: '#888780',
        fontSize: '14px',
        margin: '0 0 4px'
    },
    sport: {
        color: '#888780',
        fontSize: '13px',
        margin: 0
    },
    descrizione: {
        color: '#B4B2A9',
        fontSize: '14px',
        lineHeight: 1.5,
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        color: '#888780',
        fontSize: '12px',
        fontWeight: 500,
        marginBottom: '6px'
    },
    input: {
        width: '100%',
        background: '#1C1F26',
        border: 'none',
        borderRadius: '14px',
        padding: '14px 16px',
        marginBottom: '14px',
        color: '#FAEEDA',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    rigaDoppia: {
        display: 'flex',
        gap: '10px'
    },
    colonna: {
        flex: 1
    },
    prezzoBox: {
        background: '#1C1F26',
        borderRadius: '20px',
        padding: '16px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px'
    },
    etichettaPrezzo: {
        color: '#5F5E5A',
        fontSize: '12px',
        margin: '0 0 2px'
    },
    prezzo: {
        color: '#FAEEDA',
        fontSize: '22px',
        fontWeight: 500,
        margin: 0
    },
    unita: {
        fontSize: '13px',
        fontWeight: 400,
        color: '#888780'
    },
    bottonePrenota: {
        background: '#FAC775',
        border: 'none',
        borderRadius: '100px',
        padding: '12px 28px',
        color: '#412402',
        fontWeight: 500,
        fontSize: '14px',
        cursor: 'pointer'
    },
    messaggio: {
        color: '#97C459',
        fontSize: '13px',
        marginTop: '14px',
        textAlign: 'center'
    }
};

export default DettaglioCampo;