// src/App.jsx — Aura — Fase 2
// Routing manual (sin React Router) para MVP — navegación por estado
import { useState, useCallback } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import BookDetailPage from './pages/BookDetailPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function getInitialPage() {
  const path = window.location.pathname;
  if (path === '/admin' || path.endsWith('/admin')) return { name: 'admin', params: {} };
  return { name: 'home', params: {} };
}

function AppContent() {
  const [page, setPage] = useState(getInitialPage);

  const navigate = useCallback((name, params = {}) => {
    setPage({ name, params });
    // Update URL without page reload
    const urlMap = { home: '/', catalog: '/catalog', admin: '/admin' };
    window.history.pushState({}, '', urlMap[name] || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
    switch (page.name) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'catalog':
        return (
          <CatalogPage
            onNavigate={navigate}
            initialFilter={page.params?.filter}
            key={page.params?.filter || 'all'} // re-mount on filter change
          />
        );
      case 'book-detail':
        return page.params?.book
          ? <BookDetailPage book={page.params.book} onNavigate={navigate} key={page.params.book.id} />
          : <HomePage onNavigate={navigate} />;
      case 'contact':
        return <ContactPage onNavigate={navigate} />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">Ir al contenido principal</a>
      <Navbar onNavigate={navigate} currentPage={page.name} />
      <CartSidebar onNavigate={navigate} />
      <div className="app__content">
        {renderPage()}
      </div>
      <Footer onNavigate={navigate} />
    </div>
  );
}

// Contact page inline (simple, per MVP scope)
function ContactPage({ onNavigate }) {
  return (
    <main id="main-content" className="contact-page">
      <div className="container">
        <div className="contact-page__hero">
          <h1>Contacto</h1>
          <p>Estamos para ayudarte. Escribinos o llamanos.</p>
        </div>
        <div className="contact-page__layout">
          <div className="contact-page__info">
            <h2>Editorial Aguilera</h2>
            <p>Tu editorial jurídica de confianza desde 1985</p>
            <ul className="contact-page__list">
              <li>📍 <span>Buenos Aires, Argentina</span></li>
              <li>📞 <a href="tel:+541100000000">(011) XXXX-XXXX</a></li>
              <li>✉ <a href="mailto:tienda@editorialaguilera.com.ar">tienda@editorialaguilera.com.ar</a></li>
              <li>
                🟢
                <a
                  href="https://api.whatsapp.com/send?phone=5491100000000&text=Hola! Quería consultar sobre..."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Escribinos por WhatsApp
                </a>
              </li>
            </ul>
            <div className="contact-page__hours">
              <h3>Horario de atención</h3>
              <p>Lunes a Viernes: 9:00 a 18:00 hs</p>
              <p>Sábados: 9:00 a 13:00 hs</p>
            </div>
          </div>
          <form
            className="contact-page__form"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Formulario de contacto"
          >
            <h2>Envianos un mensaje</h2>
            <div className="contact-page__field">
              <label htmlFor="contact-name">Nombre completo *</label>
              <input id="contact-name" type="text" required placeholder="Dr. Juan García" />
            </div>
            <div className="contact-page__field">
              <label htmlFor="contact-email">Correo electrónico *</label>
              <input id="contact-email" type="email" required placeholder="juan@estudio.com.ar" />
            </div>
            <div className="contact-page__field">
              <label htmlFor="contact-subject">Asunto</label>
              <input id="contact-subject" type="text" placeholder="Consulta sobre un libro" />
            </div>
            <div className="contact-page__field">
              <label htmlFor="contact-message">Mensaje *</label>
              <textarea id="contact-message" required rows="5" placeholder="Escribí tu consulta aquí..." />
            </div>
            <button id="contact-submit-btn" type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
