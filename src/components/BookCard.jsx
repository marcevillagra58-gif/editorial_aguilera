// src/components/BookCard.jsx — Aura — Fase 2
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrecio } from '../data/books';
import './BookCard.css';

export default function BookCard({ book, onNavigate }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const descuento = book.precioAnterior
    ? Math.round((1 - book.precio / book.precioAnterior) * 100)
    : null;

  return (
    <article
      className="book-card"
      onClick={() => onNavigate('book-detail', { book })}
      tabIndex={0}
      role="article"
      aria-label={`${book.titulo} — ${book.autor}`}
      onKeyDown={(e) => e.key === 'Enter' && onNavigate('book-detail', { book })}
      id={`book-card-${book.id}`}
    >
      {/* Badges */}
      <div className="book-card__badges">
        {book.novedad && <span className="badge badge-new">NUEVO</span>}
        {book.masVendido && !book.novedad && <span className="badge badge-navy">MÁS VENDIDO</span>}
        {descuento && <span className="badge badge-gold">-{descuento}%</span>}
      </div>

      {/* Cover */}
      <div className="book-card__cover-wrap">
        <img
          src={book.portada}
          alt={`Portada de ${book.titulo}`}
          className="book-card__cover"
          loading="lazy"
        />
        <div className="book-card__overlay">
          <button
            id={`btn-detail-${book.id}`}
            className="book-card__overlay-btn"
            onClick={(e) => { e.stopPropagation(); onNavigate('book-detail', { book }); }}
            aria-label={`Ver ficha completa de ${book.titulo}`}
          >
            Ver ficha completa
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="book-card__body">
        <p className="book-card__materia">{book.materia.toUpperCase()}</p>
        <h3 className="book-card__title">{book.titulo}</h3>
        <p className="book-card__autor">{book.autor}</p>
        <p className="book-card__edicion">{book.edicion} · {book.anio}</p>

        {/* Price */}
        <div className="book-card__price-row">
          {book.precioAnterior && (
            <span className="book-card__price-old">{formatPrecio(book.precioAnterior)}</span>
          )}
          <span className="book-card__price">{formatPrecio(book.precio)}</span>
        </div>

        {/* CTA */}
        <button
          id={`btn-add-cart-${book.id}`}
          className={`btn btn-cart ${added ? 'btn-cart--added' : ''}`}
          onClick={handleAdd}
          aria-label={`Agregar al carrito: ${book.titulo}`}
        >
          {added ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              ¡Agregado!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              Agregar al carrito
            </>
          )}
        </button>
      </div>
    </article>
  );
}
