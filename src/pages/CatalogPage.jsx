// src/pages/CatalogPage.jsx — Aura — Fase 2
import { useState, useMemo, useEffect } from 'react';
import { categorias, formatPrecio } from '../data/books';
import BookCard from '../components/BookCard';
import './CatalogPage.css';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'novedad', label: 'Más recientes' },
  { value: 'titulo', label: 'Título A-Z' },
];

export default function CatalogPage({ onNavigate, initialFilter }) {
  const [activeMateria, setActiveMateria] = useState(initialFilter || 'all');
  const [sortBy, setSortBy] = useState('relevance');
  const [search, setSearch] = useState('');
  const [soloNovedades, setSoloNovedades] = useState(initialFilter === 'novedades');
  const [soloMasVendidos, setSoloMasVendidos] = useState(initialFilter === 'masVendido');
  const [soloOfertas, setSoloOfertas] = useState(false);
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let result = [...books];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.titulo.toLowerCase().includes(q) ||
        b.autor.toLowerCase().includes(q)
      );
    }

    // Materia
    if (activeMateria && activeMateria !== 'all' && activeMateria !== 'novedades' && activeMateria !== 'masVendido') {
      result = result.filter(b => b.materia === activeMateria);
    }

    // Filters
    if (soloNovedades || activeMateria === 'novedades') result = result.filter(b => b.novedad);
    if (soloMasVendidos || activeMateria === 'masVendido') result = result.filter(b => b.masVendido);
    if (soloOfertas) result = result.filter(b => b.precioAnterior);

    // Sort
    switch (sortBy) {
      case 'precio-asc': result.sort((a, b) => a.precio - b.precio); break;
      case 'precio-desc': result.sort((a, b) => b.precio - a.precio); break;
      case 'novedad': result.sort((a, b) => b.anio - a.anio); break;
      case 'titulo': result.sort((a, b) => a.titulo.localeCompare(b.titulo)); break;
    }

    return result;
  }, [search, activeMateria, sortBy, soloNovedades, soloMasVendidos, soloOfertas]);

  const activeLabel = activeMateria === 'all'
    ? 'Todo el catálogo'
    : categorias.find(c => c.id === activeMateria)?.label || 'Catálogo';

  return (
    <main id="main-content" className="catalog-page">
      <div className="catalog-page__hero">
        <div className="container">
          <div className="catalog-page__hero-inner">
            <div>
              <p className="catalog-page__breadcrumb">
                <button onClick={() => onNavigate('home')} className="catalog-page__breadcrumb-link">Inicio</button>
                <span> / </span>
                <span>{activeLabel}</span>
              </p>
              <h1 className="catalog-page__title">{activeLabel}</h1>
              <p className="catalog-page__count">{filtered.length} título{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            <input
              id="catalog-search-input"
              type="search"
              className="catalog-page__search"
              placeholder="Buscar en el catálogo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar en el catálogo"
            />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="catalog-page__layout">
          {/* Sidebar filters */}
          <aside className="catalog-filters" aria-label="Filtros del catálogo">
            <div className="catalog-filters__section">
              <h3 className="catalog-filters__title">Por materia</h3>
              <ul className="catalog-filters__list" role="list">
                <li>
                  <button
                    id="filter-all"
                    className={`catalog-filters__item ${activeMateria === 'all' ? 'catalog-filters__item--active' : ''}`}
                    onClick={() => setActiveMateria('all')}
                    aria-pressed={activeMateria === 'all'}
                  >
                    Todo el catálogo
                    <span className="catalog-filters__count">{books.length}</span>
                  </button>
                </li>
                {categorias.filter(c => c.id !== 'novedades').map(cat => {
                  const count = books.filter(b => b.materia === cat.id).length;
                  if (!count) return null;
                  return (
                    <li key={cat.id}>
                      <button
                        id={`filter-${cat.id}`}
                        className={`catalog-filters__item ${activeMateria === cat.id ? 'catalog-filters__item--active' : ''}`}
                        onClick={() => setActiveMateria(cat.id)}
                        aria-pressed={activeMateria === cat.id}
                      >
                        {cat.label}
                        <span className="catalog-filters__count">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="catalog-filters__section">
              <h3 className="catalog-filters__title">Filtros</h3>
              {[
                { id: 'filter-novedades', label: 'Solo novedades', state: soloNovedades, setter: setSoloNovedades },
                { id: 'filter-masvendidos', label: 'Más vendidos', state: soloMasVendidos, setter: setSoloMasVendidos },
                { id: 'filter-ofertas', label: 'Con descuento', state: soloOfertas, setter: setSoloOfertas },
              ].map(f => (
                <label key={f.id} className="catalog-filters__check" htmlFor={f.id}>
                  <input
                    id={f.id}
                    type="checkbox"
                    checked={f.state}
                    onChange={(e) => f.setter(e.target.checked)}
                    className="catalog-filters__checkbox"
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </aside>

          {/* Results */}
          <div className="catalog-results">
            <div className="catalog-results__bar">
              <p className="catalog-results__total">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="catalog-results__sort">
                <label htmlFor="sort-select" className="catalog-results__sort-label">Ordenar:</label>
                <select
                  id="sort-select"
                  className="catalog-results__sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Ordenar resultados"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="catalog-empty">
                <p className="catalog-empty__icon">🔍</p>
                <p className="catalog-empty__title">No encontramos libros que coincidan con tu búsqueda</p>
                <p className="catalog-empty__sub">Intentá con otro término o explorá por materia</p>
                <button
                  id="catalog-empty-reset-btn"
                  className="btn btn-outline"
                  onClick={() => { setSearch(''); setActiveMateria('all'); setSoloNovedades(false); setSoloMasVendidos(false); setSoloOfertas(false); }}
                >
                  Ver todo el catálogo
                </button>
              </div>
            ) : (
              <div className="grid-auto" role="list" aria-label={`${filtered.length} libros encontrados`}>
                {filtered.map(book => (
                  <BookCard key={book.id} book={book} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
