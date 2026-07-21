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
              <h4 className="footer__col-title">EDITORIAL AGUILERA</h4>
              <p className="footer__tagline">
                Tu editorial jurídica de confianza desde 1985
              </p>
              <p className="footer__desc">
                Más de 500 títulos especializados en derecho para abogados, estudiantes y docentes de todo el país.
              </p>
              
              {/* Social at bottom left */}
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
                <a
                  href="https://api.whatsapp.com/send?phone=5491156151265&text=Hola! Quería consultar sobre un libro."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Editorial Aguilera"
                  className="footer__social-link"
                  id="footer-whatsapp"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#25D366"/>
                    <path fill="white" fillRule="evenodd" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM11.999 2C6.478 2 2 6.478 2 12c0 1.852.504 3.585 1.384 5.076L2 22l5.076-1.384C8.415 21.496 10.148 22 12 22c5.521 0 10-4.478 10-10S17.521 2 12 2z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links & Center Logo */}
            <div className="footer__col footer__col--center">
              <h4 className="footer__col-title">COMPRAS</h4>
              <nav aria-label="Links de compras">
                <ul className="footer__links">
                  {['Cómo comprar', 'Formas de pago', 'Envíos y plazos', 'Cambios y devoluciones'].map(item => (
                    <li key={item}>
                      <button className="footer__link">{item}</button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="footer__logo-center-wrap">
                <img src="/logo.png" alt="Logo Editorial Aguilera" className="footer__logo-center" />
              </div>
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
