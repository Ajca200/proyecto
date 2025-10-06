import React from 'react';
import '../css/CookieConsent.css'; // Crea un archivo CSS para los estilos

const CookieConsent = ({ onAccept }) => {
  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-content">
        <p>
          Utilizamos cookies para mejorar tu experiencia en nuestra web y
          mostrarte contenido personalizado. Al continuar navegando, aceptas el
          uso de estas cookies. Para más información, consulta nuestra{' '}
          <a href="/politica-de-privacidad" className="cookie-link">
            Política de Privacidad
          </a>
          .
        </p>
        <button onClick={onAccept} className="cookie-accept-btn">
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;