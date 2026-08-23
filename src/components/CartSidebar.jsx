// src/components/CartSidebar.jsx — Aura — Fase 2
import { useCart } from '../context/CartContext';
import { formatPrecio } from '../data/books';
import './CartSidebar.css';

export default function CartSidebar({ onNavigate }) {
  const { items, removeItem, updateQty, clearCart, total, count, isOpen, setIsOpen } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="cart-overlay"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <aside className="cart-sidebar" role="dialog" aria-label="Carrito de compras" aria-modal="true">
        {/* Header */}
        <div className="cart-sidebar__header">
          <h2 className="cart-sidebar__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Mi carrito {count > 0 && <span className="cart-sidebar__count">({count})</span>}
          </h2>
          <button
            id="cart-close-btn"
            className="cart-sidebar__close"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar carrito"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="cart-sidebar__body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>
              <p className="cart-empty__title">Tu carrito está vacío</p>
              <p className="cart-empty__sub">Explorá nuestro catálogo y encontrá lo que necesitás</p>
              <button
                id="cart-empty-catalog-btn"
                className="btn btn-primary"
                onClick={() => { setIsOpen(false); onNavigate('catalog'); }}
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            <ul className="cart-items" aria-label="Libros en el carrito">
              {items.map(item => (
                <li key={item.id} className="cart-item" id={`cart-item-${item.id}`}>
                  <img
                    src={item.portada}
                    alt={`Portada de ${item.titulo}`}
                    className="cart-item__img"
                  />
                  <div className="cart-item__info">
                    <p className="cart-item__title">{item.titulo}</p>
                    <p className="cart-item__autor">{item.autor}</p>
                    <p className="cart-item__price">{formatPrecio(item.precio)}</p>
                    {/* Qty controls */}
                    <div className="cart-item__qty">
                      <button
                        id={`cart-qty-minus-${item.id}`}
                        className="cart-item__qty-btn"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label="Reducir cantidad"
                      >−</button>
                      <span className="cart-item__qty-num" aria-live="polite">{item.qty}</span>
                      <button
                        id={`cart-qty-plus-${item.id}`}
                        className="cart-item__qty-btn"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label="Aumentar cantidad"
                      >+</button>
                    </div>
                  </div>
                  <button
                    id={`cart-remove-${item.id}`}
                    className="cart-item__remove"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Eliminar ${item.titulo} del carrito`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-sidebar__footer">
            <div className="cart-total">
              <span className="cart-total__label">Total:</span>
              <span className="cart-total__value">{formatPrecio(total)}</span>
            </div>
            <p className="cart-total__sub">* Precio sujeto a modificaciones</p>
            <button
              id="cart-clear-btn"
              className="cart-clear-btn"
              onClick={clearCart}
              aria-label="Vaciar carrito"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
