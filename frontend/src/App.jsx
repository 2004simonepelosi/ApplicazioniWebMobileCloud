import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registrazione from './Registrazione';
import Home from './Home';
import DettaglioCampo from './DettaglioCampo';
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
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
