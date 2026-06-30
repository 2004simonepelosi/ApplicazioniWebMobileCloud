import Registrazione from './Registrazione';
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
            <Registrazione />
        </div>
    );
}

export default App;