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
            <p className="cart-total__sub">* Precio de lista. Envío calculado al finalizar.</p>
            <a
              id="cart-whatsapp-btn"
              href={`https://api.whatsapp.com/send?phone=5491100000000&text=Hola! Quiero consultar sobre mi pedido. Total: ${formatPrecio(total)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M11.999 2C6.478 2 2 6.478 2 12c0 1.852.504 3.585 1.384 5.076L2 22l5.076-1.384C8.415 21.496 10.148 22 12 22c5.521 0 10-4.478 10-10S17.521 2 12 2z"/>
              </svg>
              Consultar disponibilidad
            </a>
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
