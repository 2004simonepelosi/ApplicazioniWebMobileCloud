const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('database.db');

app.use(cors());
app.use(express.json());

// Creazione tabelle (in ordine di dipendenza)
db.exec(`
    CREATE TABLE IF NOT EXISTS utenti (
                                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                                          nome TEXT NOT NULL,
                                          cognome TEXT NOT NULL,
                                          email TEXT UNIQUE NOT NULL,
                                          password TEXT NOT NULL,
                                          ruolo TEXT NOT NULL DEFAULT 'utente',
                                          telefono TEXT
    );

    CREATE TABLE IF NOT EXISTS campi (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         id_gestore INTEGER NOT NULL,
                                         nome TEXT NOT NULL,
                                         sport TEXT NOT NULL,
                                         descrizione TEXT,
                                         indirizzo TEXT,
                                         prezzo_ora REAL NOT NULL,
                                         max_giocatori INTEGER,
                                         foto_url TEXT,
                                         disponibile INTEGER NOT NULL DEFAULT 1,
                                         FOREIGN KEY (id_gestore) REFERENCES utenti(id)
        );

    CREATE TABLE IF NOT EXISTS prenotazioni (
                                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                id_utente INTEGER NOT NULL,
                                                id_campo INTEGER NOT NULL,
                                                data TEXT NOT NULL,
                                                ora_inizio TEXT NOT NULL,
                                                ora_fine TEXT NOT NULL,
                                                num_partecipanti INTEGER,
                                                note TEXT,
                                                stato TEXT NOT NULL DEFAULT 'in attesa',
                                                FOREIGN KEY (id_utente) REFERENCES utenti(id),
        FOREIGN KEY (id_campo) REFERENCES campi(id)
        );

    CREATE TABLE IF NOT EXISTS pagamenti (
                                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             id_prenotazione INTEGER NOT NULL UNIQUE,
                                             importo REAL NOT NULL,
                                             stato TEXT NOT NULL DEFAULT 'in attesa',
                                             metodo TEXT,
                                             data_pagamento TEXT,
                                             FOREIGN KEY (id_prenotazione) REFERENCES prenotazioni(id)
        );

    CREATE TABLE IF NOT EXISTS recensioni (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              id_utente INTEGER NOT NULL,
                                              id_campo INTEGER NOT NULL,
                                              stelle INTEGER NOT NULL,
                                              commento TEXT,
                                              data TEXT NOT NULL,
                                              FOREIGN KEY (id_utente) REFERENCES utenti(id),
        FOREIGN KEY (id_campo) REFERENCES campi(id)
        );

    CREATE TABLE IF NOT EXISTS notifiche (
                                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             id_utente INTEGER NOT NULL,
                                             messaggio TEXT NOT NULL,
                                             letta INTEGER NOT NULL DEFAULT 0,
                                             data TEXT NOT NULL,
                                             FOREIGN KEY (id_utente) REFERENCES utenti(id)
        );

    CREATE TABLE IF NOT EXISTS servizi_campo (
                                                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 id_campo INTEGER NOT NULL,
                                                 servizio TEXT NOT NULL,
                                                 FOREIGN KEY (id_campo) REFERENCES campi(id)
        );
`);

// Route di test
app.get('/', (req, res) => {
    res.json({ messaggio: 'Backend funzionante!' });
});

// Registrazione utente
app.post('/utenti/registra', (req, res) => {
    const { nome, cognome, email, password, telefono } = req.body;

    if (!nome || !cognome || !email || !password) {
        return res.status(400).json({ errore: 'Tutti i campi obbligatori devono essere compilati' });
    }

    try {
        const stmt = db.prepare(`
      INSERT INTO utenti (nome, cognome, email, password, telefono)
      VALUES (?, ?, ?, ?, ?)
    `);
        const risultato = stmt.run(nome, cognome, email, password, telefono);

        res.status(201).json({ messaggio: 'Utente registrato!', id: risultato.lastInsertRowid });
    } catch (errore) {
        res.status(400).json({ errore: 'Email già registrata' });
    }
});

// Login utente
app.post('/utenti/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ errore: 'Email e password sono obbligatorie' });
    }

    const utente = db.prepare('SELECT * FROM utenti WHERE email = ?').get(email);

    if (!utente) {
        return res.status(401).json({ errore: 'Email o password errati' });
    }

    if (utente.password !== password) {
        return res.status(401).json({ errore: 'Email o password errati' });
    }

    res.json({
        messaggio: 'Login riuscito!',
        utente: {
            id: utente.id,
            nome: utente.nome,
            cognome: utente.cognome,
            email: utente.email,
            ruolo: utente.ruolo
        }
    });
});

// Vedere tutti i campi disponibili
app.get('/campi', (req, res) => {
    const campi = db.prepare('SELECT * FROM campi WHERE disponibile = 1').all();
    res.json(campi);
});

// Creare un nuovo campo (lato gestore)
app.post('/campi', (req, res) => {
    const { id_gestore, nome, sport, descrizione, indirizzo, prezzo_ora, max_giocatori, foto_url } = req.body;

    if (!id_gestore || !nome || !sport || !prezzo_ora) {
        return res.status(400).json({ errore: 'Gestore, nome, sport e prezzo sono obbligatori' });
    }

    const stmt = db.prepare(`
    INSERT INTO campi (id_gestore, nome, sport, descrizione, indirizzo, prezzo_ora, max_giocatori, foto_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const risultato = stmt.run(id_gestore, nome, sport, descrizione, indirizzo, prezzo_ora, max_giocatori, foto_url);

    res.status(201).json({ messaggio: 'Campo creato!', id: risultato.lastInsertRowid });
});

// Creare una prenotazione
app.post('/prenotazioni', (req, res) => {
    const { id_utente, id_campo, data, ora_inizio, ora_fine, num_partecipanti, note } = req.body;

    if (!id_utente || !id_campo || !data || !ora_inizio || !ora_fine) {
        return res.status(400).json({ errore: 'Utente, campo, data e orario sono obbligatori' });
    }

    // Controlliamo che l'orario non sia già occupato per quel campo
    // Due fasce orarie si sovrappongono se: inizio_nuova < fine_esistente E fine_nuova > inizio_esistente
    const conflitto = db.prepare(`
    SELECT * FROM prenotazioni
    WHERE id_campo = ? AND data = ? AND stato != 'cancellata'
    AND ora_inizio < ? AND ora_fine > ?
  `).get(id_campo, data, ora_fine, ora_inizio);

    if (conflitto) {
        return res.status(409).json({ errore: 'Orario già prenotato per questo campo' });
    }

    const stmt = db.prepare(`
    INSERT INTO prenotazioni (id_utente, id_campo, data, ora_inizio, ora_fine, num_partecipanti, note)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    const risultato = stmt.run(id_utente, id_campo, data, ora_inizio, ora_fine, num_partecipanti, note);

    res.status(201).json({ messaggio: 'Prenotazione creata!', id: risultato.lastInsertRowid });
});

app.listen(3000, () => {
    console.log('Server avviato su http://localhost:3000');
});