import React from 'react';
import HeaderHome from './components/Header';
import './css/home.css'; // New CSS file

// Placeholder data for products
const featuredProducts = [
  { id: 1, name: 'Producto 1', price: '$19.99', image: 'https://picsum.photos/400/300?random=1' },
  { id: 2, name: 'Producto 2', price: '$29.99', image: 'https://picsum.photos/400/300?random=2' },
  { id: 3, name: 'Producto 3', price: '$39.99', image: 'https://picsum.photos/400/300?random=3' },
  { id: 4, name: 'Producto 4', price: '$49.99', image: 'https://picsum.photos/400/300?random=4' },
];

const Home = () => {
  return (
    <>
      <HeaderHome />
      <main className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>La mejor moda de temporada</h1>
            <p>Descubre las últimas tendencias y renueva tu estilo.</p>
            <button className="cta-button">Comprar ahora</button>
          </div>
        </section>

        {/* Featured Products Section */}
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

        {/* How It Works Section */}
        <section className="how-it-works">
          <h2>¿Cómo Comprar?</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Selecciona tu Producto</h3>
                <p>Explora nuestro catálogo y elige lo que más te guste.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Agrega al Carrito</h3>
                <p>Añade tus productos a la cesta de compra.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Confirma tu Compra</h3>
                <p>Revisa tu pedido y confirma los detalles.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Elige Método de Pago</h3>
                <p>Selecciona cómo quieres pagar.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Realiza el Pago</h3>
                <p>Completa el pago de forma segura.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">6</div>
              <div className="step-content">
                <h3>Sube tu Comprobante</h3>
                <p>Adjunta la confirmación de tu pago.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">7</div>
              <div className="step-content">
                <h3>Recibe en Casa</h3>
                <p>¡Espera tu pedido en la puerta de tu casa!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="payment-methods">
          <h2>Métodos de Pago</h2>
          <div className="payment-icons">
            <div className="payment-icon">
              <svg fill="#003087" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.333 23.428c-1.937 0-3.343-1.284-3.343-3.033 0-1.363.786-2.375 2.11-2.88l.23-.089c.082-.03.14-.082.168-.162.028-.08.007-.175-.05-.244l-.004-.005c-.473-.61-.687-1.32-.687-2.112 0-1.53.952-2.864 2.634-3.41.116-.037.203-.132.21-.25l.01-.123.003-.03c.046-.5.16-.96.33-1.38.34-.84.84-1.53 1.47-2.04.63-.52 1.38-.86 2.2-.99.12-.02.23-.1.3-.22.07-.12.08-.26.03-.38l-.01-.02c-.19-.44-.29-.9-.29-1.37 0-.96.5-1.81 1.3-2.3.1-.06.22-.07.33-.02.11.05.18.15.18.27l.01.12.03.52.02.28.02.3c.01.08.05.16.12.2.07.04.16.05.24.02.1-.03.19-.08.28-.12.84-.36 1.75-.54 2.69-.54 2.4 0 4.25 1.24 4.25 3.03 0 1.36-.79 2.37-2.11 2.88l-.23.09c-.08.03-.14.08-.17.16-.03.08-.01.18.05.25l.004.004c.47.61.68 1.32.68 2.11 0 1.53-.95 2.87-2.63 3.41-.12.04-.2.13-.21.25l-.01.12-.004.03c-.04.5-.16.96-.33 1.38-.34.84-.84 1.53-1.47 2.04-.63.52-1.38-.86-2.2.99-.12.02-.23.1-.3.22-.07.12-.08.26-.03.38l.01.02c.19.44.29.9.29-1.37 0-.96-.5-1.81-1.3-2.3-.1-.06-.22-.07-.33-.02-.11.05-.18.15.18.27l-.01.12-.03.52-.02.28-.02.3c-.01.08-.05.16-.12.2-.07.04-.16.05-.24.02-.1-.03-.19-.08-.28-.12-.84-.36-1.75-.54-2.69-.54-2.12 0-3.8.9-4.18 2.18-.1.33-.39.56-.75.56h-.02zM8.66 12.18c-.02.1-.06.18-.13.24-.6.5-1.01 1.2-1.01 2.02 0 .7.2 1.32.58 1.85.05.07.06.16.03.24-.03.08-.1.13-.18.15l-.25.09c-1.03.38-1.6.99-1.6 1.71 0 .9.87 1.63 2.15 1.63 1.02 0 1.8-.45 2.11-1.2.07-.17.24-.28.42-.28.1 0 .2.03.29.08.82.43 1.74.65 2.7.65 1.73 0 3.12-1.08 3.12-2.55 0-.8-.4-1.5-.9-2.03-.06-.06-.08-.15-.05-.23.03-.08.1-.13.18-.15l.25-.09c-1.03-.38-1.6-.99-1.6-1.71 0-.9-.87-1.63-2.15-1.63-1.02 0-1.8.45-2.11 1.2-.07.17-.24-.28-.42-.28-.1 0-.2-.03-.29-.08-.82-.43-1.74-.65-2.7-.65-1.45 0-2.68.72-2.95 1.7zm8.23-7.1c-.02.1-.06.18-.13.24-.6.5-1.01 1.2-1.01 2.02 0 .7.2 1.32.58 1.85.05.07.06.16.03.24-.03.08-.1.13-.18.15l-.25.09c-1.03.38-1.6.99-1.6 1.71 0 .9.87 1.63 2.15 1.63 1.02 0 1.8-.45 2.11-1.2.07-.17.24-.28.42-.28.1 0 .2.03.29.08.82.43 1.74.65 2.7.65 1.73 0 3.12-1.08 3.12-2.55 0-.8-.4-1.5-.9-2.03-.06-.06-.08-.15-.05-.23.03-.08.1-.13.18-.15l.25-.09c-1.03-.38-1.6-.99-1.6-1.71 0-.9-.87-1.63-2.15-1.63-1.02 0-1.8.45-2.11 1.2-.08.17-.24.28-.43.28-.1 0-.2-.03-.28-.08-.82-.43-1.74-.65-2.7-.65-1.45 0-2.68.72-2.95 1.7z"/></svg>
              <span>PayPal</span>
            </div>
            <div className="payment-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
              <span>Pago Móvil</span>
            </div>
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
    </>
  );
};

export default Home;
