// src/components/Footer.jsx — Aura + Sos Pluma — Fase 2
import './Footer.css';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer" role="contentinfo">
      {/* Trust bar */}
      <div className="footer__trust">
        <div className="container">
          <div className="footer__trust-grid">
            {[
              { icon: '🚚', title: 'Envío gratis', sub: 'en compras +$80.000' },
              { icon: '💳', title: 'Hasta 6 cuotas', sub: 'sin interés' },
              { icon: '🔒', title: 'Compra segura', sub: 'Plataforma protegida' },
              { icon: '📦', title: 'Despacho rápido', sub: 'en 24/48 hs hábiles' },
            ].map(item => (
              <div key={item.title} className="footer__trust-item">
                <span className="footer__trust-icon">{item.icon}</span>
                <div>
                  <p className="footer__trust-title">{item.title}</p>
                  <p className="footer__trust-sub">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <img src="/logo.png" alt="Logo Editorial Aguilera" className="footer__logo" />
              <p className="footer__tagline">
                Tu editorial jurídica de confianza desde 1985
              </p>
              <p className="footer__desc">
                Más de 500 títulos especializados en derecho para abogados, estudiantes y docentes de todo el país.
              </p>
              {/* Social */}
              <div className="footer__social">
                <a href="#" aria-label="Facebook Editorial Aguilera" className="footer__social-link" id="footer-facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram Editorial Aguilera" className="footer__social-link" id="footer-instagram">
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
                    <a href="mailto:tienda@editorialaguilera.com.ar" className="footer__link footer__link--contact">
                      ✉ tienda@editorialaguilera.com.ar
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
            <p>© 2025 Editorial Aguilera. Todos los derechos reservados. · CABA, Argentina</p>
            <div className="footer__bottom-links">
              <button className="footer__bottom-link">Términos y condiciones</button>
              <button className="footer__bottom-link">Política de privacidad</button>
              <button className="footer__bottom-link">Botón de arrepentimiento</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
