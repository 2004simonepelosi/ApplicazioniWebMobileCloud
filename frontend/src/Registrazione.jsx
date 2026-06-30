import { useState } from 'react';

function Registrazione() {
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [errore, setErrore] = useState('');
    const [successo, setSuccesso] = useState(false);

    const handleRegistrazione = async (e) => {
        e.preventDefault();
        setErrore('');

        const risposta = await fetch('http://localhost:3000/utenti/registra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, cognome, email, telefono, password })
        });

        const dati = await risposta.json();

        if (!risposta.ok) {
            setErrore(dati.errore);
            return;
        }

        setSuccesso(true);
    };

    return (
        <div style={styles.schermo}>
            <div style={styles.icona}>⚽</div>

            <h1 style={styles.titolo}>Crea account</h1>
            <p style={styles.sottotitolo}>Inizia a prenotare i tuoi campi</p>

            <form onSubmit={handleRegistrazione}>
                <div style={styles.rigaDoppia}>
                    <div style={styles.colonna}>
                        <label style={styles.label}>NOME</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.colonna}>
                        <label style={styles.label}>COGNOME</label>
                        <input
                            type="text"
                            value={cognome}
                            onChange={(e) => setCognome(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                </div>

                <label style={styles.label}>EMAIL</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <label style={styles.label}>TELEFONO</label>
                <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    style={styles.input}
                />

                <label style={styles.label}>PASSWORD</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <button type="submit" style={styles.bottone}>Registrati</button>
            </form>

            {errore && <p style={styles.errore}>{errore}</p>}
            {successo && <p style={styles.successo}>Registrazione completata! Ora puoi accedere.</p>}
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
    icona: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: '#FAC775',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        marginBottom: '20px'
    },
    titolo: {
        color: '#FAEEDA',
        fontSize: '26px',
        fontWeight: 500,
        margin: '0 0 6px'
    },
    sottotitolo: {
        color: '#888780',
        fontSize: '14px',
        margin: '0 0 28px'
    },
    rigaDoppia: {
        display: 'flex',
        gap: '10px'
    },
    colonna: {
        flex: 1
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
    bottone: {
        width: '100%',
        background: '#FAC775',
        border: 'none',
        borderRadius: '14px',
        padding: '15px 0',
        color: '#412402',
        fontWeight: 500,
        fontSize: '15px',
        cursor: 'pointer',
        marginTop: '8px'
    },
    errore: {
        color: '#F09595',
        fontSize: '13px',
        marginTop: '12px'
    },
    successo: {
        color: '#97C459',
        fontSize: '13px',
        marginTop: '12px'
    }
};

export default Registrazione;