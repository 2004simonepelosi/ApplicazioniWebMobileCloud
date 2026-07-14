# ApplicazioniWebMobileCloud
Progetto Applicazioni Web Mobile Cloud SPORTBOOKING
# SPORTBOOKING
Sportbooking nasce per facilitare l'esperienza di molti sportivi, attraverso SportBooking gli atleti potranno 
prenotare in maniera rapida e veloce il proprio campo.

SportBoking distingue gli utenti in 3 macro categorie:
- Utente --> semplice utente fruitore del servizio
    - Registrazione e login con password cifrata (bcrypt)
    - Visualizzazione campi sportivi disponibili con filtri per sport
    - Prenotazione campo con selezione slot orari (visualizzazione disponibilità in tempo reale)
    - Gestione prenotazioni personali (visualizzazione, cancellazione)
    - Sistema notifiche (conferma/rifiuto prenotazioni)
    -  Profilo utente con statistiche
- Admin --> utente amministratore del sistema:
    - Home dashboard con statistiche globali (utenti, campi, prenotazioni)
    - Gestione ruoli utenti (utente → gestore → admin)
    - Visualizzazione tutte le prenotazioni
    - Admin di default creato automaticamente al primo avvio
        - Email: admin@sportbooking.it
        - Password: admin1234 (cambio obbligatorio al primo accesso)

- Gestore --> Gestore campi e prenotazioni:
    - Dashboard con statistiche campi e prenotazioni
    - Creazione e gestione campi sportivi (con tipo superficie per tennis/padel)
    - Conferma/rifiuto prenotazioni ricevute
    - Notifiche automatiche agli utenti

## Architettura

L'applicazione segue un'architettura **client-server a 3 livelli**:
| Livello | Tecnologia | Descrizione |
|---------|-----------|-------------|
| **Client** | React + Vite | SPA con routing lato client (React Router DOM) |
| **Server** | Node.js + Express | API REST in ascolto sulla porta 3000 |
| **Database** | SQLite | File locale `database.db` gestito con better-sqlite3 |

Il frontend comunica con il backend tramite chiamate HTTP REST (JSON). L'URL del backend è configurato tramite la variabile d'ambiente `VITE_API_URL`.



- **React** — permette di realizzare una SPA (Single Page Application): l'app cambia pagina senza ricaricare il browser, offrendo un'esperienza utente fluida.
- **Node.js + Express** — stesso linguaggio del frontend (JavaScript).
- **SQLite** — database senza server separato: il file del database risiede direttamente nella cartella del progetto.



### Stack tecnologico

| Layer | Tecnologia |
|-------|-----------|
| Frontend | React 18, Vite, React Router DOM |
| Backend | Node.js, Express.js |
| Database | SQLite (better-sqlite3) |
| Sicurezza | bcrypt (hashing password) |
| Configurazione | dotenv |
| UI Icons | Tabler Icons (CDN) |
| Deployment | Render.com |

---



## Schema Database

![Diagramma ER](diagramma-er.png)

##API Endpoints

### Utenti
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | /utenti/registra | Registrazione nuovo utente |
| POST | /utenti/login | Login utente |
| GET | /utenti | Lista tutti gli utenti |
| PUT | /utenti/:id/ruolo | Modifica ruolo utente |
| PUT | /utenti/:id/password | Cambio password |

### Campi
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | /campi | Lista campi disponibili |
| GET | /campi/:id | Dettaglio singolo campo |
| POST | /campi | Crea nuovo campo |
| GET | /campi/gestore/:id | Campi di un gestore |

### Prenotazioni
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | /prenotazioni | Crea prenotazione |
| GET | /prenotazioni/utente/:id | Prenotazioni di un utente |
| GET | /prenotazioni/campo/:id | Prenotazioni di un campo |
| PUT | /prenotazioni/:id/conferma | Conferma prenotazione |
| PUT | /prenotazioni/:id/cancella | Cancella prenotazione |
| GET | /prenotazioni/orari-occupati/:id_campo/:data | Slot orari occupati |

### Notifiche
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | /notifiche/:id_utente | Notifiche di un utente |
| PUT | /notifiche/:id/leggi | Segna notifica come letta |
| PUT | /notifiche/leggi-tutte/:id_utente | Segna tutte come lette |

### Admin
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | /admin/statistiche | Statistiche globali |
| GET | /admin/prenotazioni | Tutte le prenotazioni |
            
---

## Istruzioni di Build/Run

### Prerequisiti
- Node.js >= 20.x
- npm >= 9.x
- Git

### 1. Clona repository
```bash
git clone https://github.com/2004simonepelosi/ApplicazioniWebMobileCloud
cd ApplicazioniWebMobileCloud
```

### 2. Configura e avvia il Backend
```bash
cd backend
npm install
echo "PORT=3000" > .env
node index.js
```
server disponibile su `http://localhost:3000`

> Al primo avvio viene creato automaticamente un utente admin:
> - Email: `admin@sportbooking.it`
> - Password: `admin1234` *(cambio obbligatorio al primo accesso)*

### 3. Configura e avvia il Frontend
Apri un nuovo terminale:
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev
```
L'app sarà disponibile su `http://localhost:5173`

---

## Deploy

Il progetto è deployato su [Render.com](https://render.com) si aggiorna automaticamente ad ogni push (CI/CD automatico).

### Backend (Web Service)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `node index.js`
- **Variabili d'ambiente:** `PORT=3000`

### Frontend (Static Site)
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Variabili d'ambiente:** `VITE_API_URL=https://applicazioniwebmobilecloud.onrender.com`





## Sicurezza

- Le password vengono cifrate con **bcrypt** (10 salt rounds) prima di essere salvate nel database
- Le variabili sensibili sono gestite tramite file `.env` esclusi da git tramite `.gitignore`
- L'admin di default richiede cambio password obbligatorio al primo accesso







