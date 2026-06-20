# Mockup delle schermate — SportBooking

Documento di riferimento per la progettazione dell'interfaccia, da riutilizzare nella relazione finale.

## Stile scelto

Tema scuro (dark mode), card colorate a tinta piena (no foto generiche), navigazione tramite tab bar fissa in basso, diversa per ogni ruolo utente. Le immagini reali dei campi (caricate dai gestori tramite il campo `foto_url`) sostituiranno i colori pieni nell'implementazione finale.

## Schermate — ruolo Utente

Tab bar: Home · Cerca · Prenotazioni · Notifiche · Profilo

1. **Home** — saluto personalizzato, filtri per sport (Tutti/Calcio/Tennis/Padel), lista campi disponibili con nome, distanza, valutazione e prezzo/ora. Layout a griglia asimmetrico: un campo in evidenza più grande, gli altri più piccoli.

2. **Dettaglio campo** — header colorato con nome, indirizzo, valutazione e numero massimo giocatori; badge dei servizi (illuminazione, spogliatoi, parcheggio — da tabella `servizi_campo`); selettore data (7 giorni) e orario disponibile; riepilogo prezzo e pulsante "Prenota".

3. **Le mie prenotazioni** — tab Prossime/Passate; ogni prenotazione mostra campo, data/ora e stato (Confermata/In attesa/Cancellata) con colori semantici, collegato al campo `stato` della tabella `prenotazioni`.

4. **Profilo** — avatar con iniziali, ruolo, statistiche (prenotazioni, recensioni, preferiti), menu (dati personali, metodi di pagamento, recensioni, impostazioni, logout).

## Schermate — ruolo Gestore

Tab bar: Campi · Prenotazioni · Statistiche · Notifiche · Profilo

5. **Dashboard gestore** — statistiche giornaliere (prenotazioni e incasso), lista dei campi gestiti con stato attivo/inattivo, sezione "Da confermare" con richieste di prenotazione in attesa (azioni conferma/rifiuta).

## Schermate — ruolo Admin

Tab bar: Dashboard · Utenti · Campi · Notifiche · Profilo

6. **Dashboard admin** — metriche generali del sistema (utenti totali, campi attivi, prenotazioni/mese, incasso/mese), richieste di promozione a gestore da approvare, log delle attività recenti di sistema.

## Note di progettazione

- La tab bar cambia contenuto in base al ruolo dell'utente loggato: questo riflette la logica di permessi differenziati richiesta dal progetto (utente / gestore / admin).
- Le schermate di dettaglio (es. dettaglio campo) non hanno tab bar fissa, ma una freccia "indietro" — sono considerate schermate secondarie, non di navigazione principale.
- Colori usati per stato delle prenotazioni: verde (confermata), giallo/ambra (in attesa), rosso (cancellata) — scelta semantica standard.
