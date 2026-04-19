import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritosProvider } from './context/FavoritosContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Favoritos from './pages/Favoritos';
import Original from './pages/Original';
import Informativa from './pages/Informativa';
import Usuario from './pages/Usuario';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <FavoritosProvider>
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/original" element={<Original />} />
            <Route path="/informativa" element={<Informativa />} />
            <Route path="/usuario" element={<Usuario />} />
          </Routes>
        </div>
      </FavoritosProvider>
    </BrowserRouter>
  );
}

export default App;
