// src/components/Footer.jsx — Aura + Sos Pluma — Fase 2
import './Footer.css';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer" role="contentinfo">
      {/* Main footer */}
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <img src="/logo.png" alt="Logo Editorial Aguilera" className="footer__logo" />
              <p className="footer__desc">
                Más de 500 títulos especializados en derecho para abogados, estudiantes y docentes de todo el país. Tu editorial jurídica de confianza desde 1985.
              </p>
              
              {/* Social */}
              <div className="footer__social">
                <a href="https://www.instagram.com/editorialaguilera/" target="_blank" aria-label="Instagram Editorial Aguilera" className="footer__social-link" id="footer-instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="footer__col">
              <h4 className="footer__col-title">Compras</h4>
              <nav aria-label="Links de compras">
                <ul className="footer__links">
                  {['Cómo comprar', 'Formas de pago', 'Envíos y plazos', 'Cambios y devoluciones'].map(item => (
                    <li key={item}>
                      <button className="footer__link">{item}</button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="footer__col">
              <h4 className="footer__col-title">Ayuda</h4>
              <nav aria-label="Links de ayuda">
                <ul className="footer__links">
                  <li><button className="footer__link">Preguntas frecuentes</button></li>
                  <li>
                    <button className="footer__link" onClick={() => onNavigate('contact')}>Contacto</button>
                  </li>
                  <li>
                    <a href="tel:+5491156151265" className="footer__link footer__link--contact">
                      📞 +54 9 11-5615-1265
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=contacto@editorialaguilera.com.ar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer__link footer__link--contact"
                    >
                      ✉ contacto@editorialaguilera.com.ar
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-inner">
            <p>© 2026 Editorial Aguilera. Todos los derechos reservados. · Hurlingham, Buenos Aires, Argentina</p>
            <div className="footer__bottom-links">
              <button className="footer__bottom-link">Términos y condiciones</button>
              <button className="footer__bottom-link">Política de privacidad</button>
              <a
                href="https://www.mavdigital.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__dev-link"
                title="Desarrollado por MaV Digital"
              >
                <span>Desarrollado por</span>
                <img src="/Logo MaVDigital.png" alt="MaV Digital" className="footer__dev-logo" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
