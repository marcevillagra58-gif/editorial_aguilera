// src/pages/BookDetailPage.jsx — Aura — Fase 2
import { useState, useEffect } from 'react';
import { formatPrecio } from '../data/books';
import { useCart } from '../context/CartContext';
import BookCard from '../components/BookCard';
import './BookDetailPage.css';

export default function BookDetailPage({ book, onNavigate }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetch(`/api/books?materia=${book.materia}`)
      .then(res => res.json())
      .then(data => {
        setRelated(data.filter(b => b.id !== book.id).slice(0, 4));
      })
      .catch(err => console.error('Error fetching related books:', err));
  }, [book.materia, book.id]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const descuento = book.precioAnterior
    ? Math.round((1 - book.precio / book.precioAnterior) * 100)
    : null;

  return (
    <main id="main-content" className="book-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="book-detail__breadcrumb" aria-label="Navegación de página">
          <button className="book-detail__bc-link" onClick={() => onNavigate('home')}>Inicio</button>
          <span> / </span>
          <button className="book-detail__bc-link" onClick={() => onNavigate('catalog', { filter: book.materia })}>
            {book.materia.charAt(0).toUpperCase() + book.materia.slice(1)}
          </button>
          <span> / </span>
          <span className="book-detail__bc-current">{book.titulo}</span>
        </nav>

        <div className="book-detail__layout">
          {/* Cover */}
          <div className="book-detail__cover-col">
            <div className="book-detail__cover-wrap">
              {book.novedad && <span className="badge badge-new book-detail__badge">NUEVO</span>}
              {descuento && <span className="badge badge-gold book-detail__badge-discount">-{descuento}%</span>}
              <img
                src={book.portada}
                alt={`Portada de ${book.titulo}`}
                className="book-detail__cover"
              />
            </div>
            {/* Trust mini */}
            <div className="book-detail__trust">
              <div className="book-detail__trust-item">🚚 <span>Envío gratis +$80.000</span></div>
              <div className="book-detail__trust-item">💳 <span>Hasta 6 cuotas</span></div>
              <div className="book-detail__trust-item">📦 <span>Despacho en 24/48 hs</span></div>
              <div className="book-detail__trust-item">🔒 <span>Compra segura</span></div>
            </div>
          </div>

          {/* Info */}
          <div className="book-detail__info">
            <p className="book-detail__materia">{book.materia.toUpperCase()}</p>
            <h1 className="book-detail__title">{book.titulo}</h1>
            <p className="book-detail__autor">Por {book.autor}</p>

            {/* Price */}
            <div className="book-detail__price-block">
              {book.precioAnterior && (
                <div className="book-detail__price-row">
                  <span className="book-detail__price-old">{formatPrecio(book.precioAnterior)}</span>
                  <span className="book-detail__discount-badge">-{descuento}% OFF</span>
                </div>
              )}
              <span className="book-detail__price">{formatPrecio(book.precio)}</span>
              <p className="book-detail__price-sub">Precio de lista. IVA incluido.</p>
            </div>

            {/* Meta */}
            <dl className="book-detail__meta">
              {[
                { dt: 'Edición', dd: book.edicion },
                { dt: 'Año', dd: book.anio },
                { dt: 'Páginas', dd: `${book.paginas} páginas` },
                { dt: 'Formato', dd: book.formato === 'papel' ? '📖 Libro en papel' : '💻 Digital' },
                { dt: 'ISBN', dd: book.isbn },
              ].map(({ dt, dd }) => (
                <div key={dt} className="book-detail__meta-row">
                  <dt>{dt}:</dt>
                  <dd>{dd}</dd>
                </div>
              ))}
            </dl>

            {/* Qty + Add to cart */}
            <div className="book-detail__cta-block">
              <div className="book-detail__qty">
                <label htmlFor="book-detail-qty" className="book-detail__qty-label">Cantidad:</label>
                <div className="book-detail__qty-controls">
                  <button
                    id="book-detail-qty-minus"
                    className="book-detail__qty-btn"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    aria-label="Reducir cantidad"
                  >−</button>
                  <input
                    id="book-detail-qty"
                    type="number"
                    min="1"
                    max="10"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="book-detail__qty-input"
                    aria-label="Cantidad de libros"
                  />
                  <button
                    id="book-detail-qty-plus"
                    className="book-detail__qty-btn"
                    onClick={() => setQty(q => Math.min(10, q + 1))}
                    aria-label="Aumentar cantidad"
                  >+</button>
                </div>
              </div>

              <button
                id="book-detail-add-cart-btn"
                className={`btn book-detail__add-btn ${added ? 'btn-cart--added' : 'btn-primary'}`}
                onClick={handleAdd}
                aria-label={`Agregar ${qty} ${qty === 1 ? 'ejemplar' : 'ejemplares'} al carrito`}
              >
                {added ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    ¡Agregado al carrito!
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    Agregar al carrito
                  </>
                )}
              </button>

              <a
                id="book-detail-whatsapp-btn"
                href={`https://api.whatsapp.com/send?phone=5491100000000&text=Hola! Quiero consultar sobre el libro: "${book.titulo}" de ${book.autor}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline book-detail__wa-btn"
                aria-label="Consultar por WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM11.999 2C6.478 2 2 6.478 2 12c0 1.852.504 3.585 1.384 5.076L2 22l5.076-1.384C8.415 21.496 10.148 22 12 22c5.521 0 10-4.478 10-10S17.521 2 12 2z"/>
                </svg>
                Consultar por WhatsApp
              </a>
            </div>

            {/* Description */}
            <div className="book-detail__desc">
              <h2 className="book-detail__desc-title">Descripción</h2>
              <p className="book-detail__desc-text">{book.descripcion}</p>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="book-detail__related" aria-label="Libros relacionados">
            <div className="section-header">
              <div className="section-header__title">
                <h2>También te puede interesar</h2>
              </div>
              <button
                id="related-see-all-btn"
                className="see-all"
                onClick={() => onNavigate('catalog', { filter: book.materia })}
              >
                Ver más →
              </button>
            </div>
            <div className="grid-auto">
              {related.map(b => (
                <BookCard key={b.id} book={b} onNavigate={onNavigate} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
