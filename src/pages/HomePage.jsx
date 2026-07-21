// src/pages/HomePage.jsx — Aura — Fase 2
import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { categorias, formatPrecio } from '../data/books';
import BookCard from '../components/BookCard';
import './HomePage.css';

export default function HomePage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('novedades');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsEmail, setNewsEmail] = useState('');
  const [newsStatus, setNewsStatus] = useState(null); // null | 'loading' | 'ok' | 'error' | 'exists'
  const [newsMsg, setNewsMsg] = useState('');

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          console.error('API did not return an array:', data);
          setBooks([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setLoading(false);
      });
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsEmail) return;
    setNewsStatus('loading');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsEmail }),
      });
      const data = await res.json();
      if (res.status === 201 || res.ok) {
        setNewsStatus('ok');
        setNewsMsg(data.message || '¡Te suscribiste con éxito!');
        setNewsEmail('');
      } else if (res.status === 409) {
        setNewsStatus('exists');
        setNewsMsg('Este email ya está registrado.');
      } else {
        setNewsStatus('error');
        setNewsMsg('Ocurrió un error. Intentá de nuevo.');
      }
    } catch {
      setNewsStatus('error');
      setNewsMsg('No se pudo conectar. Intentá más tarde.');
    }
  };

  const novedades = books.filter(b => b.novedad).slice(0, 6);
  const masVendidos = books.filter(b => b.masVendido).slice(0, 6);
  const ofertaBooks = books.filter(b => b.precioAnterior).slice(0, 6);

  const tabBooks = {
    novedades,
    masVendidos,
    ofertas: ofertaBooks,
  };

  const categoriasDestacadas = categorias.slice(1, 7); // skip 'novedades'

  // Helper to render dynamic icon as image
  const renderIcon = (iconPath, label) => {
    return <img src={iconPath} alt={label} className="cat-bar__img-icon" />;
  };

  return (
    <main id="main-content">
      {/* HERO */}
      <section className="hero" aria-label="Bienvenida a Editorial Aguilera">
        <div className="hero__bg">
          <img src="/hero.png" alt="Libros jurídicos de Editorial Aguilera" className="hero__img" />
          <div className="hero__gradient" />
        </div>
        <div className="container">
          <div className="hero__content">
            <div className="hero__badge">
              <span className="badge badge-gold">📚 Editorial Jurídica Argentina</span>
            </div>
            <h1 className="hero__title">
              Encontrá el libro de<br />
              <span className="hero__title-highlight">derecho</span> que necesitás
            </h1>
            <p className="hero__subtitle">
              Más de 500 títulos especializados en derecho.<br />
              Enviamos a todo el país.
            </p>
            <div className="hero__cta-group">
              <button
                id="hero-cta-primary"
                className="btn btn-primary hero__cta"
                onClick={() => onNavigate('catalog')}
              >
                Ver catálogo completo
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button
                id="hero-cta-secondary"
                className="btn btn-secondary hero__cta"
                onClick={() => onNavigate('catalog', { filter: 'novedades' })}
              >
                Ver novedades
              </button>
            </div>
            <div className="hero__trust">
              <span>🚚 Envío gratis +$80.000</span>
              <span className="hero__trust-sep">·</span>
              <span>💳 Hasta 6 cuotas</span>
              <span className="hero__trust-sep">·</span>
              <span>🔒 Compra segura</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY BAR */}
      <section className="cat-bar section--sm" aria-label="Navegación por materia">
        <div className="container">
          <div className="cat-bar__scroll">
            <div className="cat-bar__track">
              {categorias.map(cat => (
                <button
                  key={`orig-${cat.id}`}
                  id={`cat-btn-${cat.id}`}
                  className="cat-bar__item"
                  onClick={() => onNavigate('catalog', { filter: cat.id })}
                  aria-label={`Ver libros de ${cat.label}`}
                >
                  <span className="cat-bar__icon">{renderIcon(cat.icon, cat.label)}</span>
                  <span className="cat-bar__label">{cat.label}</span>
                </button>
              ))}
              {/* Duplicado para el efecto infinito (Marquee) */}
              {categorias.map(cat => (
                <button
                  key={`clone-${cat.id}`}
                  className="cat-bar__item"
                  onClick={() => onNavigate('catalog', { filter: cat.id })}
                  aria-hidden="true"
                  tabIndex="-1"
                >
                  <span className="cat-bar__icon">{renderIcon(cat.icon, cat.label)}</span>
                  <span className="cat-bar__label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED TABS — Novedades / Más vendidos / Ofertas */}
      <section className="section featured" aria-label="Libros destacados">
        <div className="container">
          <div className="featured__header">
            <div className="featured__tabs" role="tablist" aria-label="Tipos de libros destacados">
              {[
                { id: 'novedades', label: '✨ Novedades' },
                { id: 'masVendidos', label: '🏆 Más vendidos' },
                { id: 'ofertas', label: '🏷️ Ofertas' },
              ].map(tab => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  className={`featured__tab ${activeTab === tab.id ? 'featured__tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              id="featured-see-all-btn"
              className="see-all"
              onClick={() => onNavigate('catalog', { filter: activeTab })}
              aria-label={`Ver todos los libros de ${activeTab}`}
            >
              Ver todos →
            </button>
          </div>

          <div className="grid-auto" role="tabpanel" aria-label={`Libros: ${activeTab}`}>
            {(tabBooks[activeTab] || []).map(book => (
              <BookCard key={book.id} book={book} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="promo-banner" aria-label="Oferta especial">
        <div className="container">
          <div className="promo-banner__inner">
            <div className="promo-banner__text">
              <p className="promo-banner__tag">OFERTA DE LA SEMANA</p>
              <h2 className="promo-banner__title">
                Guía de Estudio — Derecho Laboral
              </h2>
              <p className="promo-banner__desc">
                12ª edición actualizada · Dr. Julio A. Grisolia · 380 páginas
              </p>
              <div className="promo-banner__price">
                <span className="promo-banner__price-val">{formatPrecio(28000)}</span>
                <span className="promo-banner__price-label">precio de lista</span>
              </div>
              <button
                id="promo-banner-cta"
                className="btn btn-primary"
                onClick={() => onNavigate('book-detail', { book: books.find(b => b.id === 12) })}
              >
                Ver ficha completa →
              </button>
            </div>
            <div className="promo-banner__img-wrap">
              <img src="/book_penal.png" alt="Guía de Estudio Derecho Laboral" className="promo-banner__img" />
            </div>
          </div>
        </div>
      </section>

      {/* POR MATERIA */}
      <section className="section by-subject" aria-label="Libros por materia">
        <div className="container">
          <div className="section-header">
            <div className="section-header__title">
              <h2>Explorá por materia</h2>
              <p className="section-header__subtitle">Encontrá exactamente lo que necesitás</p>
            </div>
          </div>

          <div className="by-subject__grid">
            {categoriasDestacadas.map(cat => {
              const catBooks = books.filter(b => b.materia === cat.id).slice(0, 3);
              if (!catBooks.length) return null;
              return (
                <div key={cat.id} className="by-subject__group">
                  <div className="by-subject__group-header">
                    <h3 className="by-subject__group-title">
                      <span>{cat.icon}</span> {cat.label}
                    </h3>
                    <button
                      id={`subject-see-all-${cat.id}`}
                      className="see-all"
                      onClick={() => onNavigate('catalog', { filter: cat.id })}
                    >
                      Ver todos →
                    </button>
                  </div>
                  <div className="by-subject__books">
                    {catBooks.map(book => (
                      <div
                        key={book.id}
                        className="by-subject__book-row"
                        onClick={() => onNavigate('book-detail', { book })}
                        tabIndex={0}
                        role="button"
                        aria-label={`Ver ${book.titulo}`}
                        onKeyDown={(e) => e.key === 'Enter' && onNavigate('book-detail', { book })}
                      >
                        <img src={book.portada} alt={`Portada ${book.titulo}`} className="by-subject__book-img" />
                        <div className="by-subject__book-info">
                          <p className="by-subject__book-title">{book.titulo}</p>
                          <p className="by-subject__book-autor">{book.autor}</p>
                          <p className="by-subject__book-price">{formatPrecio(book.precio)}</p>
                        </div>
                        {book.novedad && <span className="badge badge-new">NUEVO</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter section--sm" aria-label="Suscripción al newsletter">
        <div className="container">
          <div className="newsletter__inner">
            <div className="newsletter__text">
              <h2 className="newsletter__title">Recibí nuestras novedades</h2>
              <p className="newsletter__sub">Enterate antes que nadie de los nuevos lanzamientos y promociones exclusivas.</p>
            </div>
            <form
              className="newsletter__form"
              onSubmit={handleSubscribe}
              aria-label="Formulario de suscripción al newsletter"
            >
              {newsStatus === 'ok' ? (
                <div className="newsletter__success">
                  🎉 {newsMsg}
                </div>
              ) : (
                <>
                  <input
                    id="newsletter-email-input"
                    type="email"
                    className="newsletter__input"
                    placeholder="Tu correo electrónico"
                    aria-label="Ingresá tu correo electrónico"
                    value={newsEmail}
                    onChange={e => { setNewsEmail(e.target.value); setNewsStatus(null); }}
                    required
                    disabled={newsStatus === 'loading'}
                  />
                  <button
                    id="newsletter-submit-btn"
                    type="submit"
                    className="btn btn-primary"
                    disabled={newsStatus === 'loading'}
                  >
                    {newsStatus === 'loading' ? 'Enviando...' : 'Suscribirme'}
                  </button>
                </>
              )}
              {(newsStatus === 'error' || newsStatus === 'exists') && (
                <p className="newsletter__error">{newsMsg}</p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
