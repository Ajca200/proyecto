import React, { useState, useEffect } from 'react';
import HeaderHome from './components/Header';
import './css/home.css'; // New CSS file
import CookieConsent from './components/CookieConsent'; // Importa el nuevo componente

// Placeholder data for products
const featuredProducts = [
  { id: 1, name: 'Producto 1', price: '$19.99', image: 'https://picsum.photos/400/300?random=1' },
  { id: 2, name: 'Producto 2', price: '$29.99', image: 'https://picsum.photos/400/300?random=2' },
  { id: 3, name: 'Producto 3', price: '$39.99', image: 'https://picsum.photos/400/300?random=3' },
  { id: 4, name: 'Producto 4', price: '$49.99', image: 'https://picsum.photos/400/300?random=4' },
];

const Home = () => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    // Revisa si el usuario ya aceptó las cookies en el pasado
    const consent = localStorage.getItem('cookie_consent');
    if (consent !== 'accepted') {
      setShowCookieConsent(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    // Guarda la preferencia en el almacenamiento local y oculta el banner
    localStorage.setItem('cookie_consent', 'accepted');
    setShowCookieConsent(false);
  };

  return (
    <>
      <HeaderHome />
      <main className="home-page">
        {/* Sección de Héroe */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>La mejor moda de temporada</h1>
            <p>Descubre las últimas tendencias y renueva tu estilo.</p>
            <button className="cta-button">Comprar ahora</button>
          </div>
        </section>

        {/* Sección de Productos Destacados */}
        <section className="featured-products">
          <h2>Productos Destacados</h2>
          <div className="product-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="price">{product.price}</p>
                <button className="add-to-cart-button">Añadir al carrito</button>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Cómo Comprar */}
        <section className="how-it-works">
          <h2>¿Cómo Comprar?</h2>
          <div className="steps-container">
            {/* ... (pasos de compra) ... */}
          </div>
        </section>

        {/* Sección de Métodos de Pago */}
        <section className="payment-methods">
          <h2>Métodos de Pago</h2>
          <div className="payment-icons">
            {/* ... (íconos de pago) ... */}
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2025 Tu Tienda Online. Todos los derechos reservados.</p>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Muestra el componente de consentimiento de cookies si el estado es true */}
      {showCookieConsent && <CookieConsent onAccept={handleAcceptCookies} />}
    </>
  );
};

export default Home;