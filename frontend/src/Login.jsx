import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errore, setErrore] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        const risposta = await fetch('http://localhost:3000/utenti/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const dati = await risposta.json();

        if (!risposta.ok) {
            setErrore(dati.errore);
            return;
        }

        console.log('Login riuscito:', dati.utente);
    };

    return (
        <div style={styles.schermo}>
            <div style={styles.icona}>⚽</div>

            <h1 style={styles.titolo}>Bentornato</h1>
            <p style={styles.sottotitolo}>Accedi per prenotare il tuo campo</p>

            <form onSubmit={handleLogin}>
                <label style={styles.label}>EMAIL</label>
                <input
                    type="email"
                    placeholder="nome@esempio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <label style={styles.label}>PASSWORD</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <button type="submit" style={styles.bottone}>Accedi</button>
            </form>

            {errore && <p style={styles.errore}>{errore}</p>}
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
        margin: '0 0 32px'
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
    }
};

export default Login;