// src/pages/AdminPage.jsx
import { useState, useEffect, useRef } from 'react';
import './AdminPage.css';

const MATERIAS = ['civil', 'penal', 'comercial', 'laboral', 'constitucional',
  'administrativo', 'procesal', 'familia', 'tributario', 'daños', 'internacional'];

const EMPTY_FORM = {
  titulo: '', autor: '', materia: 'civil', precio: '', precioAnterior: '',
  formato: 'papel', anio: new Date().getFullYear(), edicion: '', paginas: '',
  isbn: '', novedad: false, masVendido: false, descripcion: '', portada: '', slug: ''
};

const ESTADOS_ORDEN = [
  { id: 'pendiente', label: 'Pendiente', color: '#f59e0b', bg: '#fef3c7' },
  { id: 'contactado', label: 'Contactado', color: '#3b82f6', bg: '#dbeafe' },
  { id: 'pagado', label: 'Pagado', color: '#10b981', bg: '#d1fae5' },
  { id: 'enviado', label: 'Enviado', color: '#8b5cf6', bg: '#ede9fe' },
  { id: 'entregado', label: 'Entregado', color: '#059669', bg: '#ecfdf5' },
  { id: 'cancelado', label: 'Cancelado', color: '#ef4444', bg: '#fee2e2' }
];

export default function AdminPage({ onNavigate }) {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const [msg, setMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [exitModal, setExitModal] = useState(null);

  // Tabs de Administración: 'dashboard' | 'books' | 'subscribers'
  const [adminTab, setAdminTab] = useState('dashboard');
  const [dashboardSubTab, setDashboardSubTab] = useState('pedidos'); // 'pedidos' | 'ranking' | 'clientes'

  // Suscriptores
  const [subscribers, setSubscribers] = useState([]);
  const [deleteSubConfirm, setDeleteSubConfirm] = useState(null);

  // Pedidos y Estadísticas
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('todos');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteOrderConfirm, setDeleteOrderConfirm] = useState(null);
  const [adminNotesEditing, setAdminNotesEditing] = useState('');

  const fileRef = useRef();
  const headers = { 'Content-Type': 'application/json', 'x-admin-password': pass };

  useEffect(() => {
    const savedPass = localStorage.getItem('admin_pass');
    if (savedPass) {
      setPass(savedPass);
      // Intentar validar contraseña guardada con el backend
      fetch('/api/orders/stats', { headers: { 'x-admin-password': savedPass } })
        .then(res => {
          if (res.ok) {
            setAuthed(true);
            loadAllData(savedPass);
            return res.json();
          }
        })
        .then(data => {
          if (data) setStats(data);
        })
        .catch(() => {});
    }
  }, []);

  // Protección al cerrar/recargar la pestaña
  useEffect(() => {
    if (!authed) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [authed]);

  const loadAllData = (currentPass = pass) => {
    loadBooks();
    loadSubscribers(currentPass);
    loadOrders(currentPass);
    loadStats(currentPass);
  };

  const loadBooks = async () => {
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      if (Array.isArray(data)) setBooks(data);
    } catch (e) {
      console.error('Error al cargar libros:', e);
    }
  };

  const loadSubscribers = async (currentPass = pass) => {
    try {
      const res = await fetch('/api/subscribers', { headers: { 'x-admin-password': currentPass } });
      const data = await res.json();
      if (Array.isArray(data)) setSubscribers(data);
    } catch (e) {
      console.error('Error al cargar suscriptores', e);
    }
  };

  const loadOrders = async (currentPass = pass) => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders', { headers: { 'x-admin-password': currentPass } });
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (e) {
      console.error('Error al cargar órdenes:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadStats = async (currentPass = pass) => {
    try {
      const res = await fetch('/api/orders/stats', { headers: { 'x-admin-password': currentPass } });
      const data = await res.json();
      if (data && !data.error) setStats(data);
    } catch (e) {
      console.error('Error al cargar estadísticas:', e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/orders/stats', { headers: { 'x-admin-password': pass } });
    if (res.ok) {
      localStorage.setItem('admin_pass', pass);
      setAuthed(true);
      setError('');
      loadAllData(pass);
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const safeNavigate = (dest, params = {}) => {
    setExitModal({ dest, params });
  };

  // --- Manejo de Pedidos ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ estado: newStatus })
      });
      if (res.ok) {
        setMsg(`✅ Estado del pedido actualizado a "${newStatus}"`);
        loadOrders();
        loadStats();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, estado: newStatus }));
        }
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {
      console.error('Error al actualizar estado:', e);
    }
  };

  const handleSaveOrderNotes = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ notasAdmin: adminNotesEditing })
      });
      if (res.ok) {
        setMsg('✅ Notas guardadas correctamente');
        loadOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, notasAdmin: adminNotesEditing }));
        }
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {
      console.error('Error al guardar notas:', e);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setMsg('🗑️ Pedido eliminado correctamente');
        setDeleteOrderConfirm(null);
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(null);
        }
        loadOrders();
        loadStats();
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {
      console.error('Error al eliminar pedido:', e);
    }
  };

  const exportOrdersCSV = () => {
    if (!orders.length) return;
    const csvHeader = "\uFEFFID,Fecha,Cliente,Email,Telefono,Direccion,Notas Cliente,Estado,Items,Total,Notas Admin\n";
    const csvRows = orders.map(o => {
      const fecha = new Date(o.createdAt).toLocaleString('es-AR');
      const itemsList = o.items.map(it => `${it.qty}x ${it.titulo}`).join(' | ');
      return `"${o._id.toString().slice(-6).toUpperCase()}","${fecha}","${o.cliente.nombre}","${o.cliente.email}","${o.cliente.telefono}","${o.cliente.direccion || ''}","${(o.cliente.notas || '').replace(/"/g, '""')}","${o.estado}","${itemsList.replace(/"/g, '""')}","${o.total}","${(o.notasAdmin || '').replace(/"/g, '""')}"`;
    }).join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedidos_editorial_aguilera_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportClientsCSV = () => {
    if (!stats || !stats.clientesTop || !stats.clientesTop.length) return;
    const csvHeader = "\uFEFFNombre,Email,Telefono,Direccion,Total Pedidos,Total Gastado,Ultimo Pedido\n";
    const csvRows = stats.clientesTop.map(c => {
      const ultPedido = new Date(c.ultimoPedido).toLocaleString('es-AR');
      return `"${c.nombre}","${c.email}","${c.telefono}","${c.direccion || ''}","${c.totalPedidos}","${c.totalGastado}","${ultPedido}"`;
    }).join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clientes_editorial_aguilera_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Manejo de Libros y Suscriptores ---
  const handleDeleteSubscriber = async (id) => {
    const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE', headers });
    if (res.ok) {
      setMsg('🗑️ Suscriptor eliminado');
      setDeleteSubConfirm(null);
      loadSubscribers();
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const exportSubscribersCSV = () => {
    if (subscribers.length === 0) return;
    const csvHeader = "\uFEFFEmail,Fecha de suscripción\n";
    const csvRows = subscribers.map(s => {
      const fecha = new Date(s.fechaSuscripcion).toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      return `"${s.email}","${fecha}"`;
    }).join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suscriptores_editorial_aguilera_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('portada', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': pass },
        body: fd,
      });
      const data = await res.json();
      setUploading(false);
      if (res.ok && data.url) {
        setForm(f => ({ ...f, portada: data.url }));
        setPreview(data.url);
      } else if (res.status === 401) {
        setMsg('❌ Sesión expirada o contraseña inválida. Por favor reingresá.');
        setAuthed(false);
        localStorage.removeItem('admin_pass');
      } else {
        setMsg('❌ Error al subir la portada: ' + (data.error || 'Error desconocido'));
      }
    } catch (err) {
      setUploading(false);
      setMsg('❌ Error de conexión al subir la portada');
    }
  };

  const handleEdit = (book) => {
    setForm({
      titulo: book.titulo || '', autor: book.autor || '',
      materia: book.materia || 'civil', precio: book.precio || '',
      precioAnterior: book.precioAnterior || '', formato: book.formato || 'papel',
      anio: book.anio || new Date().getFullYear(), edicion: book.edicion || '',
      paginas: book.paginas || '', isbn: book.isbn || '',
      novedad: book.novedad || false, masVendido: book.masVendido || false,
      descripcion: book.descripcion || '', portada: book.portada || '',
      slug: book.slug || ''
    });
    setPreview(book.portada || '');
    setEditingId(book.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
    setForm(EMPTY_FORM);
    setPreview('');
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      precio: Number(form.precio),
      precioAnterior: form.precioAnterior ? Number(form.precioAnterior) : null,
      paginas: Number(form.paginas),
      anio: Number(form.anio),
    };
    const url = editingId ? `/api/books/${editingId}` : '/api/books';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) {
      setMsg(editingId ? '✅ Libro actualizado' : '✅ Libro creado');
      handleNew();
      loadBooks();
      setTimeout(() => setMsg(''), 3000);
    } else {
      const err = await res.json();
      setMsg('❌ Error: ' + (err.message || 'desconocido'));
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE', headers });
    if (res.ok) {
      setMsg('🗑️ Libro eliminado');
      setDeleteConfirm(null);
      loadBooks();
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const autoSlug = (titulo) =>
    titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

  // Filtrado de pedidos
  const filteredOrders = orders.filter(order => {
    const matchStatus = orderStatusFilter === 'todos' || order.estado === orderStatusFilter;
    if (!matchStatus) return false;
    if (!orderSearch.trim()) return true;

    const term = orderSearch.toLowerCase();
    const matchClient = order.cliente.nombre.toLowerCase().includes(term) ||
      order.cliente.email.toLowerCase().includes(term) ||
      order.cliente.telefono.toLowerCase().includes(term);
    const matchId = order._id.toLowerCase().includes(term);
    const matchBook = order.items.some(it => it.titulo.toLowerCase().includes(term));
    return matchClient || matchId || matchBook;
  });

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login__card">
          <h1>Panel de Administrador</h1>
          <p>Editorial Aguilera</p>
          <form onSubmit={handleLogin}>
            <input
              type="password" placeholder="Contraseña"
              value={pass} onChange={e => setPass(e.target.value)}
              autoFocus
            />
            {error && <p className="admin-error">{error}</p>}
            <button type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>⚙ Panel de Administrador</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>{orders.length} pedidos · {books.length} libros · {subscribers.length} suscriptores</span>
          <button className="btn-exit-header" onClick={() => safeNavigate('home')}>
            ← Volver al sitio
          </button>
          <button
            className="btn-exit-header"
            style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)' }}
            onClick={() => {
              localStorage.removeItem('admin_pass');
              setAuthed(false);
              setPass('');
            }}
          >
            🔒 Cerrar sesión
          </button>
        </div>
      </header>

      {/* Navegación Principal por Pestañas */}
      <div className="admin-nav-tabs">
        <button
          className={`admin-nav-tab ${adminTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => { setAdminTab('dashboard'); loadOrders(); loadStats(); }}
        >
          📊 Ventas y Estadísticas ({orders.length})
        </button>
        <button
          className={`admin-nav-tab ${adminTab === 'books' ? 'active' : ''}`}
          onClick={() => setAdminTab('books')}
        >
          📚 Catálogo de Libros ({books.length})
        </button>
        <button
          className={`admin-nav-tab ${adminTab === 'subscribers' ? 'active' : ''}`}
          onClick={() => setAdminTab('subscribers')}
        >
          ✉️ Suscriptores Newsletter ({subscribers.length})
        </button>
      </div>

      {msg && <div className="admin-msg">{msg}</div>}

      {/* ==========================================
          TAB 1: DASHBOARD DE VENTAS Y ESTADÍSTICAS
          ========================================== */}
      {adminTab === 'dashboard' && (
        <div className="admin-dashboard-container">
          {/* Tarjetas KPI */}
          <div className="admin-kpi-grid">
            <div className="kpi-card kpi-card--gold">
              <div className="kpi-card__icon">💰</div>
              <div className="kpi-card__info">
                <span className="kpi-card__label">Facturación Total (Ventas)</span>
                <span className="kpi-card__value">
                  ${(stats?.totalVentas || 0).toLocaleString('es-AR')}
                </span>
                <span className="kpi-card__sub">Pedidos confirmados y activos</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__icon">📦</div>
              <div className="kpi-card__info">
                <span className="kpi-card__label">Total de Pedidos</span>
                <span className="kpi-card__value">
                  {stats?.totalPedidos || 0}
                  {stats?.pedidosPendientes > 0 && (
                    <span className="kpi-badge-pending">
                      {stats.pedidosPendientes} pendientes
                    </span>
                  )}
                </span>
                <span className="kpi-card__sub">Solicitudes registradas en la web</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__icon">📖</div>
              <div className="kpi-card__info">
                <span className="kpi-card__label">Libros Vendidos</span>
                <span className="kpi-card__value">
                  {(stats?.totalLibrosVendidos || 0).toLocaleString('es-AR')}
                </span>
                <span className="kpi-card__sub">Ejemplares solicitados</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__icon">👥</div>
              <div className="kpi-card__info">
                <span className="kpi-card__label">Clientes Únicos</span>
                <span className="kpi-card__value">
                  {stats?.totalClientesUnicos || 0}
                </span>
                <span className="kpi-card__sub">Compradores registrados</span>
              </div>
            </div>
          </div>

          {/* Sub-navegación del Dashboard */}
          <div className="dashboard-subnav">
            <div className="dashboard-subnav__tabs">
              <button
                className={`dashboard-subnav__btn ${dashboardSubTab === 'pedidos' ? 'active' : ''}`}
                onClick={() => setDashboardSubTab('pedidos')}
              >
                📋 Listado de Pedidos ({orders.length})
              </button>
              <button
                className={`dashboard-subnav__btn ${dashboardSubTab === 'ranking' ? 'active' : ''}`}
                onClick={() => setDashboardSubTab('ranking')}
              >
                🏆 Ranking de Libros Más Vendidos
              </button>
              <button
                className={`dashboard-subnav__btn ${dashboardSubTab === 'clientes' ? 'active' : ''}`}
                onClick={() => setDashboardSubTab('clientes')}
              >
                👤 Directorio de Clientes ({stats?.totalClientesUnicos || 0})
              </button>
            </div>

            <div className="dashboard-subnav__actions">
              {dashboardSubTab === 'pedidos' && (
                <button className="btn-export-csv" onClick={exportOrdersCSV} disabled={orders.length === 0}>
                  📥 Exportar Pedidos (CSV)
                </button>
              )}
              {dashboardSubTab === 'clientes' && (
                <button className="btn-export-csv" onClick={exportClientsCSV} disabled={!stats?.clientesTop?.length}>
                  📥 Exportar Clientes (CSV)
                </button>
              )}
            </div>
          </div>

          {/* SUBTAB: LISTADO DE PEDIDOS */}
          {dashboardSubTab === 'pedidos' && (
            <section className="admin-list-section">
              {/* Filtros y Buscador */}
              <div className="orders-toolbar">
                <div className="orders-status-filters">
                  <button
                    className={`status-pill ${orderStatusFilter === 'todos' ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter('todos')}
                  >
                    Todos ({orders.length})
                  </button>
                  {ESTADOS_ORDEN.map(st => {
                    const count = stats?.pedidosPorEstado?.[st.id] || 0;
                    return (
                      <button
                        key={st.id}
                        className={`status-pill ${orderStatusFilter === st.id ? 'active' : ''}`}
                        style={orderStatusFilter === st.id ? { borderColor: st.color, color: st.color } : {}}
                        onClick={() => setOrderStatusFilter(st.id)}
                      >
                        <span className="status-dot" style={{ background: st.color }} />
                        {st.label} ({count})
                      </button>
                    );
                  })}
                </div>

                <div className="orders-search-box">
                  <input
                    type="text"
                    placeholder="🔍 Buscar por cliente, email, teléfono o libro..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="admin-input"
                  />
                  {orderSearch && (
                    <button className="clear-search-btn" onClick={() => setOrderSearch('')}>✕</button>
                  )}
                </div>
              </div>

              {loadingOrders ? (
                <div className="admin-empty">
                  <span>⏳ Cargando pedidos...</span>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="admin-empty">
                  <span>📭 No se encontraron pedidos con los filtros seleccionados.</span>
                </div>
              ) : (
                <div className="orders-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>N° Pedido</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Contacto</th>
                        <th>Libros Solicitados</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => {
                        const statusObj = ESTADOS_ORDEN.find(s => s.id === order.estado) || ESTADOS_ORDEN[0];
                        return (
                          <tr key={order._id}>
                            <td>
                              <span className="order-id-badge">
                                #{order._id.toString().slice(-6).toUpperCase()}
                              </span>
                            </td>
                            <td className="order-date-cell">
                              {new Date(order.createdAt).toLocaleDateString('es-AR', {
                                day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
                              })}
                            </td>
                            <td>
                              <strong>{order.cliente.nombre}</strong>
                              {order.cliente.direccion && (
                                <span className="order-address-sub">📍 {order.cliente.direccion}</span>
                              )}
                            </td>
                            <td>
                              <div className="order-contact-col">
                                <a href={`mailto:${order.cliente.email}`} className="order-email-link">
                                  ✉️ {order.cliente.email}
                                </a>
                                <a href={`tel:${order.cliente.telefono}`} className="order-phone-link">
                                  📞 {order.cliente.telefono}
                                </a>
                              </div>
                            </td>
                            <td>
                              <span className="order-items-count">
                                {order.items.reduce((acc, it) => acc + it.qty, 0)} libro(s)
                              </span>
                              <div className="order-items-preview">
                                {order.items.map((it, idx) => (
                                  <span key={idx} className="order-item-chip">
                                    {it.qty}x {it.titulo}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <strong className="order-total-amount">
                                ${order.total.toLocaleString('es-AR')}
                              </strong>
                            </td>
                            <td>
                              <select
                                className="order-status-select"
                                value={order.estado}
                                style={{ color: statusObj.color, backgroundColor: statusObj.bg, borderColor: statusObj.color }}
                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              >
                                {ESTADOS_ORDEN.map(s => (
                                  <option key={s.id} value={s.id}>{s.label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="admin-actions">
                              <button
                                className="btn-edit"
                                title="Ver detalle completo"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setAdminNotesEditing(order.notasAdmin || '');
                                }}
                              >
                                👁️ Detalle
                              </button>
                              {deleteOrderConfirm === order._id ? (
                                <>
                                  <button className="btn-confirm-delete" onClick={() => handleDeleteOrder(order._id)}>
                                    ¿Borrar?
                                  </button>
                                  <button className="btn-cancel-delete" onClick={() => setDeleteOrderConfirm(null)}>
                                    No
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="btn-delete"
                                  title="Eliminar pedido"
                                  onClick={() => setDeleteOrderConfirm(order._id)}
                                >
                                  🗑️
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* SUBTAB: RANKING DE LIBROS MÁS VENDIDOS */}
          {dashboardSubTab === 'ranking' && (
            <section className="admin-list-section">
              <div className="admin-section-header">
                <div>
                  <h2>🏆 Ranking de Libros Más Vendidos</h2>
                  <p className="admin-section-sub">Títulos con mayor volumen de venta y recaudación.</p>
                </div>
              </div>

              {!stats?.rankingLibros?.length ? (
                <div className="admin-empty">
                  <span>📊 Aún no hay ventas registradas para generar el ranking de libros.</span>
                </div>
              ) : (
                <div className="ranking-grid">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Puesto</th>
                        <th>Portada</th>
                        <th>Título y Autor</th>
                        <th>Materia</th>
                        <th>Unidades Vendidas</th>
                        <th>Total Recaudado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.rankingLibros.map((item, idx) => {
                        const maxUnits = stats.rankingLibros[0]?.unidadesVendidas || 1;
                        const percent = Math.round((item.unidadesVendidas / maxUnits) * 100);
                        return (
                          <tr key={idx}>
                            <td>
                              <span className={`ranking-pos-badge pos-${idx + 1}`}>
                                #{idx + 1}
                              </span>
                            </td>
                            <td>
                              {item.portada ? (
                                <img src={item.portada} alt={item.titulo} className="admin-thumb" />
                              ) : (
                                <span className="no-img">Sin imagen</span>
                              )}
                            </td>
                            <td>
                              <strong>{item.titulo}</strong>
                              <span className="order-address-sub">{item.autor}</span>
                            </td>
                            <td>
                              <span className="badge-materia">{item.materia || 'General'}</span>
                            </td>
                            <td>
                              <div className="ranking-bar-wrapper">
                                <strong>{item.unidadesVendidas} ej.</strong>
                                <div className="ranking-bar">
                                  <div className="ranking-bar-fill" style={{ width: `${percent}%` }} />
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong className="order-total-amount">
                                ${item.totalFacturado.toLocaleString('es-AR')}
                              </strong>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* SUBTAB: DIRECTORIO DE CLIENTES */}
          {dashboardSubTab === 'clientes' && (
            <section className="admin-list-section">
              <div className="admin-section-header">
                <div>
                  <h2>👤 Directorio y Estadísticas de Clientes</h2>
                  <p className="admin-section-sub">Historial consolidado de compradores recurrentes.</p>
                </div>
              </div>

              {!stats?.clientesTop?.length ? (
                <div className="admin-empty">
                  <span>👥 Aún no hay clientes registrados.</span>
                </div>
              ) : (
                <div className="clients-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Dirección Habitual</th>
                        <th>Pedidos Realizados</th>
                        <th>Total Invertido</th>
                        <th>Última Compra</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.clientesTop.map((c, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td><strong>{c.nombre}</strong></td>
                          <td><a href={`mailto:${c.email}`} className="order-email-link">{c.email}</a></td>
                          <td><a href={`tel:${c.telefono}`} className="order-phone-link">{c.telefono}</a></td>
                          <td>{c.direccion || '—'}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="order-id-badge">{c.totalPedidos}</span>
                          </td>
                          <td>
                            <strong className="order-total-amount">
                              ${c.totalGastado.toLocaleString('es-AR')}
                            </strong>
                          </td>
                          <td className="order-date-cell">
                            {new Date(c.ultimoPedido).toLocaleDateString('es-AR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 2: CATÁLOGO DE LIBROS
          ========================================== */}
      {adminTab === 'books' && (
        <>
          <section className="admin-form-section">
            <h2>{editingId ? `Editando libro #${editingId}` : 'Agregar nuevo libro'}</h2>
            <form className="admin-form" onSubmit={handleSave}>
              <div className="admin-form__grid">
                {/* Portada */}
                <div className="admin-form__cover">
                  <div className="cover-preview" onClick={() => fileRef.current.click()}>
                    {preview
                      ? <img src={preview} alt="portada" />
                      : <span>📷 Hacer clic para subir portada</span>}
                    {uploading && <div className="cover-uploading">Subiendo...</div>}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" hidden
                    onChange={e => handleUpload(e.target.files[0])} />
                  {form.portada && (
                    <input className="admin-input" value={form.portada}
                      onChange={e => { setForm(f => ({ ...f, portada: e.target.value })); setPreview(e.target.value); }}
                      placeholder="URL de portada" />
                  )}
                </div>

                {/* Campos principales */}
                <div className="admin-form__fields">
                  <label>Título *
                    <input className="admin-input" required value={form.titulo}
                      onChange={e => {
                        const t = e.target.value;
                        setForm(f => ({ ...f, titulo: t, slug: autoSlug(t) }));
                      }} />
                  </label>
                  <label>Autor *
                    <input className="admin-input" required value={form.autor}
                      onChange={e => setForm(f => ({ ...f, autor: e.target.value }))} />
                  </label>
                  <div className="admin-form__row">
                    <label>Materia
                      <select className="admin-input" value={form.materia}
                        onChange={e => setForm(f => ({ ...f, materia: e.target.value }))}>
                        {MATERIAS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </label>
                    <label>Formato
                      <select className="admin-input" value={form.formato}
                        onChange={e => setForm(f => ({ ...f, formato: e.target.value }))}>
                        <option value="papel">Papel</option>
                        <option value="digital">Digital</option>
                        <option value="papel+digital">Papel + Digital</option>
                      </select>
                    </label>
                  </div>
                  <div className="admin-form__row">
                    <label>Precio *
                      <input className="admin-input" type="number" required value={form.precio}
                        onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} />
                    </label>
                    <label>Precio anterior
                      <input className="admin-input" type="number" value={form.precioAnterior}
                        onChange={e => setForm(f => ({ ...f, precioAnterior: e.target.value }))} />
                    </label>
                  </div>
                  <div className="admin-form__row">
                    <label>Año
                      <input className="admin-input" type="number" value={form.anio}
                        onChange={e => setForm(f => ({ ...f, anio: e.target.value }))} />
                    </label>
                    <label>Páginas
                      <input className="admin-input" type="number" value={form.paginas}
                        onChange={e => setForm(f => ({ ...f, paginas: e.target.value }))} />
                    </label>
                  </div>
                  <div className="admin-form__row">
                    <label>ISBN
                      <input className="admin-input" value={form.isbn}
                        onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} />
                    </label>
                    <label>Edición
                      <input className="admin-input" value={form.edicion}
                        onChange={e => setForm(f => ({ ...f, edicion: e.target.value }))} />
                    </label>
                  </div>
                  <div className="admin-form__checkboxes">
                    <label>
                      <input type="checkbox" checked={form.novedad}
                        onChange={e => setForm(f => ({ ...f, novedad: e.target.checked }))} />
                      Novedad
                    </label>
                    <label>
                      <input type="checkbox" checked={form.masVendido}
                        onChange={e => setForm(f => ({ ...f, masVendido: e.target.checked }))} />
                      Más vendido
                    </label>
                  </div>
                  <label>Descripción
                    <textarea className="admin-input" rows={3} value={form.descripcion}
                      onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
                  </label>
                  <div className="admin-form__actions">
                    <button type="submit" className="btn-save" disabled={saving}>
                      {saving ? 'Guardando...' : (editingId ? '💾 Guardar cambios' : '➕ Crear libro')}
                    </button>
                    {editingId && (
                      <button type="button" className="btn-cancel" onClick={handleNew}>
                        Cancelar edición
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </section>

          {/* Listado de Libros */}
          <section className="admin-list-section">
            <h2>Libros en catálogo ({books.length})</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Portada</th>
                  <th>Título</th>
                  <th>Materia</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b.id} className={editingId === b.id ? 'editing' : ''}>
                    <td>{b.id}</td>
                    <td>
                      {b.portada
                        ? <img src={b.portada} alt={b.titulo} className="admin-thumb" />
                        : <span className="no-img">Sin imagen</span>}
                    </td>
                    <td>{b.titulo}</td>
                    <td><span className="badge-materia">{b.materia}</span></td>
                    <td>${b.precio?.toLocaleString('es-AR')}</td>
                    <td className="admin-actions">
                      <button className="btn-edit" onClick={() => handleEdit(b)}>✏️ Editar</button>
                      {deleteConfirm === b.id
                        ? <>
                          <button className="btn-confirm-delete" onClick={() => handleDelete(b.id)}>
                            ¿Confirmar?
                          </button>
                          <button className="btn-cancel-delete" onClick={() => setDeleteConfirm(null)}>
                            No
                          </button>
                        </>
                        : <button className="btn-delete" onClick={() => setDeleteConfirm(b.id)}>🗑️</button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      {/* ==========================================
          TAB 3: SUSCRIPTORES NEWSLETTER
          ========================================== */}
      {adminTab === 'subscribers' && (
        <section className="admin-list-section">
          <div className="admin-section-header">
            <div>
              <h2>Suscriptores al Newsletter</h2>
              <p className="admin-section-sub">Personas registradas para recibir novedades de la editorial.</p>
            </div>
            <button
              className="btn-export-csv"
              onClick={exportSubscribersCSV}
              disabled={subscribers.length === 0}
            >
              📥 Exportar a Excel (CSV)
            </button>
          </div>

          {subscribers.length === 0 ? (
            <div className="admin-empty">
              <span>📭 Aún no hay suscriptores registrados.</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Fecha de suscripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s, idx) => (
                  <tr key={s._id || idx}>
                    <td>{idx + 1}</td>
                    <td className="sub-email">
                      <a href={`mailto:${s.email}`}>{s.email}</a>
                    </td>
                    <td>
                      {new Date(s.fechaSuscripcion).toLocaleDateString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })} hs
                    </td>
                    <td className="admin-actions">
                      {deleteSubConfirm === s._id ? (
                        <>
                          <button className="btn-confirm-delete" onClick={() => handleDeleteSubscriber(s._id)}>
                            ¿Confirmar?
                          </button>
                          <button className="btn-cancel-delete" onClick={() => setDeleteSubConfirm(null)}>
                            No
                          </button>
                        </>
                      ) : (
                        <button className="btn-delete" title="Eliminar suscriptor" onClick={() => setDeleteSubConfirm(s._id)}>
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* ==========================================
          MODAL DETALLE DE PEDIDO
          ========================================== */}
      {selectedOrder && (
        <div className="order-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="order-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="order-detail-modal__header">
              <div>
                <h2>Pedido #{selectedOrder._id.toString().slice(-6).toUpperCase()}</h2>
                <span className="order-detail-modal__date">
                  Registrado el {new Date(selectedOrder.createdAt).toLocaleString('es-AR')}
                </span>
              </div>
              <button className="order-modal__close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="order-detail-modal__body">
              {/* Sección Datos Comprador */}
              <div className="order-detail-section">
                <h3>👤 Datos del Comprador</h3>
                <div className="order-detail-grid">
                  <p><strong>Nombre:</strong> {selectedOrder.cliente.nombre}</p>
                  <p><strong>Email:</strong> <a href={`mailto:${selectedOrder.cliente.email}`}>{selectedOrder.cliente.email}</a></p>
                  <p><strong>Teléfono:</strong> <a href={`tel:${selectedOrder.cliente.telefono}`}>{selectedOrder.cliente.telefono}</a></p>
                  {selectedOrder.cliente.direccion && (
                    <p><strong>Dirección:</strong> {selectedOrder.cliente.direccion}</p>
                  )}
                  {selectedOrder.cliente.notas && (
                    <p className="order-client-notes"><strong>Notas del comprador:</strong> {selectedOrder.cliente.notas}</p>
                  )}
                </div>
              </div>

              {/* Sección Libros */}
              <div className="order-detail-section">
                <h3>📚 Libros Solicitados</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Portada</th>
                      <th>Libro</th>
                      <th>Precio Unitario</th>
                      <th>Cant.</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td>
                          {it.portada ? (
                            <img src={it.portada} alt={it.titulo} className="admin-thumb" />
                          ) : (
                            <span className="no-img">Sin imagen</span>
                          )}
                        </td>
                        <td>
                          <strong>{it.titulo}</strong>
                          <span className="order-address-sub">{it.autor}</span>
                        </td>
                        <td>${it.precio.toLocaleString('es-AR')}</td>
                        <td style={{ textAlign: 'center' }}><strong>{it.qty}</strong></td>
                        <td><strong>${(it.precio * it.qty).toLocaleString('es-AR')}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="order-detail-total-row">
                  <span>Total Estimado:</span>
                  <strong>${selectedOrder.total.toLocaleString('es-AR')}</strong>
                </div>
              </div>

              {/* Estado y Notas Internas */}
              <div className="order-detail-section">
                <h3>⚙️ Gestión Interna</h3>
                <div className="order-admin-controls">
                  <div className="form-group">
                    <label>Estado del Pedido:</label>
                    <select
                      className="admin-input"
                      value={selectedOrder.estado}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                    >
                      {ESTADOS_ORDEN.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Notas de seguimiento / Logística (Interno):</label>
                    <textarea
                      className="admin-input"
                      rows={3}
                      placeholder="Ej: Pago recibido por transferencia. Enviado por Correo Argentino guía #123456"
                      value={adminNotesEditing}
                      onChange={(e) => setAdminNotesEditing(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-save"
                      style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                      onClick={() => handleSaveOrderNotes(selectedOrder._id)}
                    >
                      💾 Guardar Notas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de salida */}
      {exitModal && (
        <div className="exit-modal-overlay">
          <div className="exit-modal">
            <div className="exit-modal__icon">⚠️</div>
            <h2>¿Salir del panel de administración?</h2>
            <p>Si salís ahora perderás tu sesión activa y deberás volver a ingresar la contraseña la próxima vez.</p>
            <div className="exit-modal__actions">
              <button
                className="exit-modal__btn-stay"
                onClick={() => setExitModal(null)}
              >
                Quedarme en el panel
              </button>
              <button
                className="exit-modal__btn-leave"
                onClick={() => {
                  setExitModal(null);
                  if (onNavigate) onNavigate(exitModal.dest, exitModal.params);
                }}
              >
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
