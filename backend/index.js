require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

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
    telefono TEXT,
    cambio_password INTEGER NOT NULL DEFAULT 0
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

// Funzione principale asincrona per il seed e avvio server
async function avvia() {

    // Seed: crea admin di default se non esiste
    const adminEsistente = db.prepare("SELECT * FROM utenti WHERE ruolo = 'admin'").get();
    if (!adminEsistente) {
        const passwordCifrata = await bcrypt.hash('admin1234', 10);
        db.prepare(`
      INSERT INTO utenti (nome, cognome, email, password, ruolo, cambio_password)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('Admin', 'Sistema', 'admin@sportbooking.it', passwordCifrata, 'admin', 1);
        console.log('✅ Admin di default creato: admin@sportbooking.it / admin1234');
    }

    // Route di test
    app.get('/', (req, res) => {
        res.json({ messaggio: 'Backend funzionante!' });
    });

    // Registrazione utente
    app.post('/utenti/registra', async (req, res) => {
        const { nome, cognome, email, password, telefono } = req.body;

        if (!nome || !cognome || !email || !password) {
            return res.status(400).json({ errore: 'Tutti i campi obbligatori devono essere compilati' });
        }

        try {
            const passwordCifrata = await bcrypt.hash(password, 10);
            const stmt = db.prepare(`
        INSERT INTO utenti (nome, cognome, email, password, telefono)
        VALUES (?, ?, ?, ?, ?)
      `);
            const risultato = stmt.run(nome, cognome, email, passwordCifrata, telefono);
            res.status(201).json({ messaggio: 'Utente registrato!', id: risultato.lastInsertRowid });
        } catch (errore) {
            res.status(400).json({ errore: 'Email già registrata' });
        }
    });

    // Login utente
    app.post('/utenti/login', async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ errore: 'Email e password sono obbligatorie' });
        }

        const utente = db.prepare('SELECT * FROM utenti WHERE email = ?').get(email);

        if (!utente) {
            return res.status(401).json({ errore: 'Email o password errati' });
        }

        const passwordCorretta = await bcrypt.compare(password, utente.password);

        if (!passwordCorretta) {
            return res.status(401).json({ errore: 'Email o password errati' });
        }

        res.json({
            messaggio: 'Login riuscito!',
            cambioPasswordRichiesto: utente.cambio_password === 1,
            utente: {
                id: utente.id,
                nome: utente.nome,
                cognome: utente.cognome,
                email: utente.email,
                ruolo: utente.ruolo
            }
        });
    });

    // Cambio password
    app.put('/utenti/:id/password', async (req, res) => {
        const idUtente = req.params.id;
        const { nuovaPassword } = req.body;

        if (!nuovaPassword || nuovaPassword.length < 6) {
            return res.status(400).json({ errore: 'La password deve essere di almeno 6 caratteri' });
        }

        const passwordCifrata = await bcrypt.hash(nuovaPassword, 10);
        db.prepare('UPDATE utenti SET password = ?, cambio_password = 0 WHERE id = ?').run(passwordCifrata, idUtente);
        res.json({ messaggio: 'Password aggiornata!' });
    });

    // Vedere tutti gli utenti
    app.get('/utenti', (req, res) => {
        const utenti = db.prepare('SELECT id, nome, cognome, email, ruolo FROM utenti').all();
        res.json(utenti);
    });

    // Cambiare il ruolo di un utente
    app.put('/utenti/:id/ruolo', (req, res) => {
        const idUtente = req.params.id;
        const { ruolo } = req.body;

        if (!['utente', 'gestore', 'admin'].includes(ruolo)) {
            return res.status(400).json({ errore: 'Ruolo non valido' });
        }

        const utente = db.prepare('SELECT * FROM utenti WHERE id = ?').get(idUtente);
        if (!utente) {
            return res.status(404).json({ errore: 'Utente non trovato' });
        }

        db.prepare('UPDATE utenti SET ruolo = ? WHERE id = ?').run(ruolo, idUtente);
        res.json({ messaggio: `Ruolo aggiornato a ${ruolo}` });
    });

    // Vedere tutti i campi disponibili
    app.get('/campi', (req, res) => {
        const campi = db.prepare('SELECT * FROM campi WHERE disponibile = 1').all();
        res.json(campi);
    });

    // Vedere il dettaglio di un singolo campo
    app.get('/campi/:id', (req, res) => {
        const idCampo = req.params.id;
        const campo = db.prepare('SELECT * FROM campi WHERE id = ?').get(idCampo);

        if (!campo) {
            return res.status(404).json({ errore: 'Campo non trovato' });
        }

        res.json(campo);
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

    // Vedere i campi di un gestore
    app.get('/campi/gestore/:id', (req, res) => {
        const idGestore = req.params.id;
        const campi = db.prepare('SELECT * FROM campi WHERE id_gestore = ?').all(idGestore);
        res.json(campi);
    });

    // Creare una prenotazione
    app.post('/prenotazioni', (req, res) => {
        const { id_utente, id_campo, data, ora_inizio, ora_fine, num_partecipanti, note } = req.body;

        if (!id_utente || !id_campo || !data || !ora_inizio || !ora_fine) {
            return res.status(400).json({ errore: 'Utente, campo, data e orario sono obbligatori' });
        }

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

    // Vedere le prenotazioni di un utente
    app.get('/prenotazioni/utente/:id', (req, res) => {
        const idUtente = req.params.id;
        const prenotazioni = db.prepare(`
      SELECT prenotazioni.*, campi.nome AS nome_campo, campi.sport
      FROM prenotazioni
      JOIN campi ON prenotazioni.id_campo = campi.id
      WHERE prenotazioni.id_utente = ?
      ORDER BY prenotazioni.data DESC
    `).all(idUtente);
        res.json(prenotazioni);
    });

    // Vedere le prenotazioni di un campo (per il gestore)
    app.get('/prenotazioni/campo/:id', (req, res) => {
        const idCampo = req.params.id;
        const prenotazioni = db.prepare(`
      SELECT prenotazioni.*, utenti.nome, utenti.cognome
      FROM prenotazioni
      JOIN utenti ON prenotazioni.id_utente = utenti.id
      WHERE prenotazioni.id_campo = ?
      ORDER BY prenotazioni.data DESC
    `).all(idCampo);
        res.json(prenotazioni);
    });

    // Cancellare una prenotazione
    app.put('/prenotazioni/:id/cancella', (req, res) => {
        const idPrenotazione = req.params.id;
        const prenotazione = db.prepare('SELECT * FROM prenotazioni WHERE id = ?').get(idPrenotazione);
        if (!prenotazione) {
            return res.status(404).json({ errore: 'Prenotazione non trovata' });
        }
        db.prepare('UPDATE prenotazioni SET stato = ? WHERE id = ?').run('cancellata', idPrenotazione);
        res.json({ messaggio: 'Prenotazione cancellata' });
    });

    // Confermare una prenotazione (gestore)
    app.put('/prenotazioni/:id/conferma', (req, res) => {
        const idPrenotazione = req.params.id;
        const prenotazione = db.prepare('SELECT * FROM prenotazioni WHERE id = ?').get(idPrenotazione);
        if (!prenotazione) {
            return res.status(404).json({ errore: 'Prenotazione non trovata' });
        }
        db.prepare('UPDATE prenotazioni SET stato = ? WHERE id = ?').run('confermata', idPrenotazione);
        res.json({ messaggio: 'Prenotazione confermata' });
    });

    // Creare una recensione
    app.post('/recensioni', (req, res) => {
        const { id_utente, id_campo, stelle, commento } = req.body;

        if (!id_utente || !id_campo || !stelle) {
            return res.status(400).json({ errore: 'Utente, campo e stelle sono obbligatori' });
        }

        if (stelle < 1 || stelle > 5) {
            return res.status(400).json({ errore: 'Le stelle devono essere tra 1 e 5' });
        }

        const data = new Date().toISOString().split('T')[0];
        const stmt = db.prepare(`
      INSERT INTO recensioni (id_utente, id_campo, stelle, commento, data)
      VALUES (?, ?, ?, ?, ?)
    `);
        const risultato = stmt.run(id_utente, id_campo, stelle, commento, data);
        res.status(201).json({ messaggio: 'Recensione creata!', id: risultato.lastInsertRowid });
    });

    // Vedere le recensioni di un campo
    app.get('/recensioni/campo/:id', (req, res) => {
        const idCampo = req.params.id;
        const recensioni = db.prepare(`
      SELECT recensioni.*, utenti.nome, utenti.cognome
      FROM recensioni
      JOIN utenti ON recensioni.id_utente = utenti.id
      WHERE recensioni.id_campo = ?
      ORDER BY recensioni.data DESC
    `).all(idCampo);
        res.json(recensioni);
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server avviato su http://localhost:${PORT}`);
    });
}

avvia();