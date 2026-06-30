import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const [campi, setCampi] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const [utente, setUtente] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/campi')
            .then(risposta => risposta.json())
            .then(dati => {
                setCampi(dati);
                setCaricamento(false);
            });

        const utenteSalvato = localStorage.getItem('utente');
        if (utenteSalvato) {
            setUtente(JSON.parse(utenteSalvato));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('utente');
        setUtente(null);
    };

    if (caricamento) {
        return <p style={{ color: '#FAEEDA' }}>Caricamento...</p>;
    }

    return (
        <div style={styles.schermo}>
            <div style={styles.header}>
                <p style={styles.titolo}>Dove giochi oggi?</p>

                {utente ? (
                    <div style={styles.utenteBox}>
                        <span style={styles.nomeUtente}>{utente.nome}</span>
                        <button onClick={handleLogout} style={styles.bottoneLogout}>Esci</button>
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} style={styles.bottoneAccedi}>Accedi</button>
                )}
            </div>

            <div style={styles.lista}>
                {campi.map((campo) => (
                    <Link key={campo.id} to={`/campo/${campo.id}`} style={styles.cardLink}>
                        <div style={styles.card}>
                            <p style={styles.nomeCampo}>{campo.nome}</p>
                            <p style={styles.dettagli}>{campo.sport} · {campo.indirizzo}</p>
                            <p style={styles.prezzo}>{campo.prezzo_ora}€/h</p>
                        </div>
                    </Link>
                ))}
            </div>
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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    titolo: {
        color: '#FAEEDA',
        fontSize: '24px',
        fontWeight: 500,
        margin: 0
    },
    utenteBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    nomeUtente: {
        color: '#FAEEDA',
        fontSize: '14px'
    },
    bottoneAccedi: {
        background: '#FAC775',
        border: 'none',
        borderRadius: '10px',
        padding: '8px 16px',
        color: '#412402',
        fontWeight: 500,
        fontSize: '13px',
        cursor: 'pointer'
    },
    bottoneLogout: {
        background: '#1C1F26',
        border: 'none',
        borderRadius: '10px',
        padding: '8px 16px',
        color: '#F09595',
        fontWeight: 500,
        fontSize: '13px',
        cursor: 'pointer'
    },
    lista: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    cardLink: {
        textDecoration: 'none'
    },
    card: {
        background: '#1C1F26',
        borderRadius: '16px',
        padding: '16px'
    },
    nomeCampo: {
        color: '#FAEEDA',
        fontSize: '16px',
        fontWeight: 500,
        margin: '0 0 4px'
    },
    dettagli: {
        color: '#888780',
        fontSize: '13px',
        margin: '0 0 8px'
    },
    prezzo: {
        color: '#FAC775',
        fontSize: '16px',
        fontWeight: 500,
        margin: 0
    }
};

export default Home;