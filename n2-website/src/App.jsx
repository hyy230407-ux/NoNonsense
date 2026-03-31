import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Track from './pages/Track';
import { CartProvider } from './context/CartContext';
import CartModal from './components/ui/CartModal';
import CustomizationModal from './components/ui/CustomizationModal';
import './index.css';


function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Menu />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/track" element={<Track />} />
            </Routes>
          </main>
          <Footer />
          <CartModal />
          <CustomizationModal />
        </div>

      </Router>
    </CartProvider>
  );
}

export default App;
