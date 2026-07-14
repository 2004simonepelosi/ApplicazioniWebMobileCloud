# Mockup— SportBooking

## Stile grafico

L'interfaccia di SportBooking è ispirata all'app Playtomic. Abbiamo scelto un tema chiaro con sfondo color panna (#F5F0E8), card bianche con bordi sottili e colori diversi per ogni sport:

- **Calcio** → Verde (#2D6A4F)
- **Tennis** → Marrone terra battuta (#8B5E3C)
- **Padel** → Blu campo (#1E3A5F)
- **Basket** → Arancione (#E85D04)

La navigazione su desktop avviene tramite una sidebar fissa a sinistra. Su mobile compare una tab bar in basso.

---

## Schermate — Utente normale

### Home
Mostra il giorno della settimana corrente e la lista dei campi disponibili. In alto a destra c'è la campanellina per le notifiche e una barra di ricerca. I filtri per sport (Tutti / Calcio / Tennis / Padel / Basket) cambiano anche il colore di sfondo della pagina. Ogni card del campo mostra nome, indirizzo, sport, tipo di superficie e prezzo orario.

### Dettaglio campo
Cliccando su un campo si apre la schermata di prenotazione. In alto c'è un header colorato con il colore dello sport, che mostra nome, indirizzo, numero massimo di giocatori e prezzo orario. Sotto si seleziona la data e gli slot orari disponibili appaiono in una griglia. Gli slot già occupati appaiono in rosso e non sono selezionabili. Una volta scelto lo slot, il pulsante "Prenota" si attiva e mostra il totale. Dopo la prenotazione si torna alla Home con un alert verde di conferma.

### Le mie prenotazioni
Divisa in due tab: **Prossime** e **Passate**. Ogni prenotazione mostra il nome del campo, lo sport, la data, l'orario e lo stato (in attesa / confermata / cancellata) con colori diversi. Le prenotazioni future possono essere cancellate.

### Notifiche
Accessibile dalla campanellina in alto o dalla sidebar. Le notifiche sono divise in **Non lette** e **Precedenti**. Ogni notifica ha un'icona e un colore diverso in base al tipo: verde per conferma, rosso per rifiuto, arancione per in attesa. In alto ci sono tre statistiche: totale notifiche, non lette e confermate.

### Profilo
Mostra una card verde con iniziali, nome completo, email e ruolo. Sotto ci sono le statistiche delle prenotazioni (totali, confermate, in attesa). Il menu permette di navigare verso le prenotazioni, le notifiche e la dashboard gestore (se si ha il ruolo). In fondo il pulsante di logout.

---

## Schermate — Gestore

### Dashboard Gestore
Accessibile solo agli utenti con ruolo gestore o admin. Mostra quattro statistiche: campi totali, prenotazioni da confermare, confermate e totali. C'è un pulsante per aggiungere un nuovo campo con un form che include nome, sport (con menu tendina), tipo di superficie (che cambia in base allo sport: per il padel Indoor/Outdoor, per il tennis Terra battuta/Cemento/Erba sintetica), indirizzo, prezzo orario, massimo giocatori e descrizione. Sotto la lista dei campi e le prenotazioni ricevute con i pulsanti Conferma e Rifiuta.

---

## Schermate — Admin

### Home Admin
L'admin non vede la home dei campi ma una dashboard con statistiche globali: utenti registrati, campi attivi, prenotazioni oggi e prenotazioni in attesa. Sotto ci sono le ultime 5 prenotazioni ricevute e gli utenti recenti. In basso due pulsanti di accesso rapido alla gestione utenti e alla gestione campi.

### Dashboard Admin
Divisa in due tab: **Prenotazioni** (tutte le prenotazioni del sistema con utente, campo, data e stato) e **Utenti** (lista di tutti gli utenti con la possibilità di cambiare il ruolo tra utente, gestore e admin).

---

## Schermate di autenticazione

### Login
Schermata con sfondo panna, card bianca centrale con i campi email e password. Link alla pagina di registrazione.

### Registrazione
Form con nome, cognome, email, telefono e password. Dopo la registrazione reindirizza automaticamente al login.

### Cambio password
Appare obbligatoriamente al primo accesso dell'admin. Chiede la nuova password e la conferma con un minimo di 6 caratteri.
