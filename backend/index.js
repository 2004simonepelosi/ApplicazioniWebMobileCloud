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

app.listen(3000, () => {
    console.log('Server avviato su http://localhost:3000');
});