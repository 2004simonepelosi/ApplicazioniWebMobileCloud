import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registrazione from './Registrazione';
import Home from './Home';
import DettaglioCampo from './DettaglioCampo';
import MiePrenotazioni from './MiePrenotazioni';
import Profilo from './Profilo';
import DashboardGestore from './DashboardGestore';
import DashboardAdmin from './DashboardAdmin';
import CambioPassword from './CambioPassword';
import './App.css';

function App() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#0F1115',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registrazione" element={<Registrazione />} />
                    <Route path="/campo/:id" element={<DettaglioCampo />} />
                    <Route path="/prenotazioni" element={<MiePrenotazioni />} />
                    <Route path="/profilo" element={<Profilo />} />
                    <Route path="/gestore" element={<DashboardGestore />} />
                    <Route path="/admin" element={<DashboardAdmin />} />
                    <Route path="/cambio-password" element={<CambioPassword />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;