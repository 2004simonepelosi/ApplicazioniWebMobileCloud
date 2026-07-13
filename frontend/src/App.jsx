import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registrazione from './Registrazione';
import Home from './Home';
import HomeAdmin from './HomeAdmin';
import DettaglioCampo from './DettaglioCampo';
import MiePrenotazioni from './MiePrenotazioni';
import Profilo from './Profilo';
import DashboardGestore from './DashboardGestore';
import DashboardAdmin from './DashboardAdmin';
import CambioPassword from './CambioPassword';
import Notifiche from './Notifiche';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home-admin" element={<HomeAdmin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registrazione" element={<Registrazione />} />
                <Route path="/campo/:id" element={<DettaglioCampo />} />
                <Route path="/prenotazioni" element={<MiePrenotazioni />} />
                <Route path="/profilo" element={<Profilo />} />
                <Route path="/gestore" element={<DashboardGestore />} />
                <Route path="/admin" element={<DashboardAdmin />} />
                <Route path="/cambio-password" element={<CambioPassword />} />
                <Route path="/notifiche" element={<Notifiche />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;