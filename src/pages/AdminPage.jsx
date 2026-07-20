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

export default function AdminPage() {
  const [authed, setAuthed]   = useState(false);
  const [pass, setPass]       = useState('');
  const [error, setError]     = useState('');
  const [books, setBooks]     = useState([]);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const [msg, setMsg]         = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileRef = useRef();

  const headers = { 'Content-Type': 'application/json', 'x-admin-password': pass };

  const loadBooks = async () => {
    const res = await fetch('/api/books');
    const data = await res.json();
    if (Array.isArray(data)) setBooks(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/books', { headers: { 'x-admin-password': pass } });
    if (res.ok) {
      setAuthed(true);
      loadBooks();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('portada', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'x-admin-password': pass },
      body: fd,
    });
    const data = await res.json();
    setUploading(false);
    if (data.url) {
      setForm(f => ({ ...f, portada: data.url }));
      setPreview(data.url);
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
    const url  = editingId ? `/api/books/${editingId}` : '/api/books';
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
        <span>{books.length} libros en catálogo</span>
      </header>

      {msg && <div className="admin-msg">{msg}</div>}

      {/* FORM */}
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
              <label>Edición
                <input className="admin-input" value={form.edicion}
                  onChange={e => setForm(f => ({ ...f, edicion: e.target.value }))} />
              </label>
              <label>ISBN
                <input className="admin-input" value={form.isbn}
                  onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} />
              </label>
              <label>Slug (URL)
                <input className="admin-input" value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
              </label>
              <label>Descripción
                <textarea className="admin-input" rows={4} value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
              </label>
              <div className="admin-form__checks">
                <label><input type="checkbox" checked={form.novedad}
                  onChange={e => setForm(f => ({ ...f, novedad: e.target.checked }))} /> Novedad</label>
                <label><input type="checkbox" checked={form.masVendido}
                  onChange={e => setForm(f => ({ ...f, masVendido: e.target.checked }))} /> Más vendido</label>
              </div>
            </div>
          </div>

          <div className="admin-form__actions">
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Guardando...' : (editingId ? '💾 Guardar cambios' : '➕ Crear libro')}
            </button>
            {editingId && <button type="button" className="btn-cancel" onClick={handleNew}>Cancelar</button>}
          </div>
        </form>
      </section>

      {/* LISTA */}
      <section className="admin-list-section">
        <h2>Catálogo actual</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th><th>Portada</th><th>Título</th><th>Materia</th>
              <th>Precio</th><th>Acciones</th>
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
    </div>
  );
}
