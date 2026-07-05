const handleLogin = async (e) => {
    e.preventDefault();
    setErrore('');

    const risposta = await fetch(`${API}/utenti/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const dati = await risposta.json();

    if (!risposta.ok) {
        setErrore(dati.errore);
        return;
    }

    localStorage.setItem('utente', JSON.stringify(dati.utente));

    if (dati.cambioPasswordRichiesto) {
        navigate('/cambio-password');
        return;
    }

    const destinazione = location.state?.tornaA || '/';
    navigate(destinazione);
};