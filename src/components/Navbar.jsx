// src/components/Navbar.jsx — Aura — Fase 2
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrecio } from '../data/books';
import './Navbar.css';

const MATERIAS = {
  'Derecho Privado': [
    { label: 'Derecho Civil', materia: 'civil' },
    { label: 'Familia y Sucesiones', materia: 'familia' },
    { label: 'Contratos', materia: 'civil' },
    { label: 'Derechos Reales', materia: 'civil' },
    { label: 'Responsabilidad Civil', materia: 'daños' },
  ],
  'Derecho Público': [
    { label: 'Derecho Constitucional', materia: 'constitucional' },
    { label: 'Derecho Administrativo', materia: 'administrativo' },
    { label: 'Derecho Tributario', materia: 'tributario' },
    { label: 'Derecho Ambiental', materia: 'ambiental' },
    { label: 'Derecho Internacional', materia: 'internacional' },
  ],
  'Otras Áreas': [
    { label: 'Derecho Penal', materia: 'penal' },
    { label: 'Derecho Procesal', materia: 'procesal' },
    { label: 'Derecho Laboral', materia: 'laboral' },
    { label: 'Derecho Comercial', materia: 'comercial' },
    { label: 'Práctica Profesional', materia: 'practica' },
  ],
};

export default function Navbar({ onNavigate, currentPage }) {
  const { count, setIsOpen } = useCart();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBooks(data);
        else setBooks([]);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const q = query.toLowerCase();
    const filtered = books
      .filter(b =>
        b.titulo.toLowerCase().includes(q) ||
        b.autor.toLowerCase().includes(q) ||
        b.materia.includes(q)
      )
      .slice(0, 5);
    setResults(filtered);
  }, [query, books]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleResultClick = (book) => {
    setQuery('');
    setResults([]);
    onNavigate('book-detail', { book });
  };

  return (
    <header className="navbar" role="banner">
      {/* Top bar */}
      <div className="navbar__topbar">
        <div className="container">
          <div className="navbar__topbar-inner">
            <div className="navbar__topbar-left">
              <span>🚚 Envío gratis en compras +$80.000</span>
              <span>💳 Hasta 6 cuotas sin interés</span>
              <span>📦 Despacho en 24/48 hs</span>
            </div>
            <div className="navbar__topbar-right">
              <a href="tel:+5491156151265">📞 +54 9 11-5615-1265</a>
              <a href="mailto:tienda@editorialaguilera.com.ar">✉ Contacto</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="navbar__main">
        <div className="container">
          <div className="navbar__inner">
            {/* Logo */}
            <a
              href="#"
              className="navbar__logo"
              onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
              aria-label="Editorial Aguilera — Ir al inicio"
            >
              <img src="/logo.png" alt="Logo Editorial Aguilera" className="navbar__logo-img" />
              <div className="navbar__logo-text">
                <span className="navbar__logo-name">Editorial Aguilera</span>
                <span className="navbar__logo-tagline">Libros Jurídicos</span>
              </div>
            </a>

            {/* Search */}
            <div className="navbar__search" ref={searchRef}>
              <input
                id="navbar-search-input"
                type="search"
                className="navbar__search-input"
                placeholder="Buscar por título, autor o materia..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar libros"
                autoComplete="off"
              />
              <button className="navbar__search-btn" aria-label="Buscar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
              {results.length > 0 && (
                <div className="navbar__search-dropdown" role="listbox" aria-label="Resultados de búsqueda">
                  {results.map(book => (
                    <div
                      key={book.id}
                      className="search-result-item"
                      onClick={() => handleResultClick(book)}
                      role="option"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleResultClick(book)}
                    >
                      <img src={book.portada} alt={book.titulo} className="search-result-img" />
                      <div className="search-result-info">
                        <div className="search-result-title">{book.titulo}</div>
                        <div className="search-result-autor">{book.autor}</div>
                      </div>
                      <div className="search-result-price">{formatPrecio(book.precio)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="navbar__actions">
              <button
                id="navbar-cart-btn"
                className="navbar__cart-btn"
                onClick={() => setIsOpen(true)}
                aria-label={`Ver carrito — ${count} ${count === 1 ? 'item' : 'items'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                Mi carrito
                {count > 0 && (
                  <span className="navbar__cart-count" aria-live="polite">{count}</span>
                )}
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              className="navbar__mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="navbar__nav" aria-label="Navegación principal">
        <div className="container">
          <div className="navbar__nav-inner">
            <div className="navbar__nav-item">
              <button
                className={`navbar__nav-link navbar__nav-link--highlight`}
                onClick={() => onNavigate('catalog', { filter: 'novedades' })}
                id="nav-novedades"
              >
                ✨ Novedades
              </button>
            </div>
            <div className="navbar__nav-item">
              <button
                className={`navbar__nav-link ${currentPage === 'catalog' ? 'active' : ''}`}
                onClick={() => onNavigate('catalog')}
                id="nav-catalogo"
              >
                Catálogo completo
              </button>
            </div>
            <div className="navbar__nav-item">
              <button className="navbar__nav-link" id="nav-materias">
                Por Materia <span className="navbar__nav-arrow">▾</span>
              </button>
              <div className="navbar__dropdown" role="menu">
                {Object.entries(MATERIAS).map(([col, items]) => (
                  <div key={col} className="navbar__dropdown-col">
                    <h4>{col}</h4>
                    {items.map(item => (
                      <a
                        key={item.label}
                        href="#"
                        role="menuitem"
                        onClick={(e) => { e.preventDefault(); onNavigate('catalog', { filter: item.materia }); }}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="navbar__nav-item">
              <button
                className="navbar__nav-link"
                onClick={() => onNavigate('catalog', { filter: 'masVendido' })}
                id="nav-mas-vendidos"
              >
                Más vendidos
              </button>
            </div>
            <div className="navbar__nav-item">
              <button
                className="navbar__nav-link"
                onClick={() => onNavigate('contact')}
                id="nav-contacto"
              >
                Contacto
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`navbar__mobile-menu ${mobileOpen ? 'open' : ''}`} aria-hidden={!mobileOpen}>
        {[
          { label: '✨ Novedades', page: 'catalog', filter: 'novedades' },
          { label: 'Catálogo completo', page: 'catalog' },
          { label: 'Derecho Civil', page: 'catalog', filter: 'civil' },
          { label: 'Derecho Penal', page: 'catalog', filter: 'penal' },
          { label: 'Derecho Laboral', page: 'catalog', filter: 'laboral' },
          { label: 'Derecho Procesal', page: 'catalog', filter: 'procesal' },
          { label: 'Más vendidos', page: 'catalog', filter: 'masVendido' },
          { label: 'Contacto', page: 'contact' },
        ].map(item => (
          <button
            key={item.label}
            className="navbar__mobile-link"
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'none', fontFamily: 'var(--font-body)' }}
            onClick={() => { onNavigate(item.page, item.filter ? { filter: item.filter } : undefined); setMobileOpen(false); }}
          >
            {item.label}
          </button>
        ))}
        {/* Mobile search */}
        <div style={{ padding: '12px 0 4px' }}>
          <input
            type="search"
            placeholder="Buscar libros..."
            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: 'var(--font-body)' }}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar libros (móvil)"
          />
        </div>
      </div>
    </header>
  );
}
