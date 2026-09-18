import { useEffect, useState } from 'react';
import {
  USING_LOCAL_DATA,
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from './api.js';
import ProductForm from './ProductForm.jsx';
import { CATEGORIES, PAGE_SIZE, STATUSES, formatDate, formatPrice } from './helpers.js';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // modal yang sedang terbuka: '', 'view', 'add', 'edit', atau 'delete'
  const [modal, setModal] = useState('');
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setLoadError('');

    try {
      setProducts(await getProducts());
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function notify(type, text) {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  }

  function closeModal() {
    setModal('');
    setSelected(null);
  }

  async function handleAdd(data) {
    setSaving(true);

    try {
      const created = await createProduct({ ...data, createdAt: new Date().toISOString() });
      setProducts([created, ...products]);
      notify('ok', `"${data.name}" has been added.`);
      closeModal();
    } catch (err) {
      notify('error', err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(data) {
    setSaving(true);

    try {
      await updateProduct(selected.id, data);

      setProducts(
        products.map((product) =>
          product.id === selected.id ? { ...product, ...data } : product,
        ),
      );

      notify('ok', `"${data.name}" has been updated.`);
      closeModal();
    } catch (err) {
      notify('error', err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);

    try {
      await deleteProduct(selected.id);
      setProducts(products.filter((product) => product.id !== selected.id));
      notify('ok', `"${selected.name}" has been deleted.`);
      closeModal();
    } catch (err) {
      notify('error', err.message);
    } finally {
      setSaving(false);
    }
  }

  // Hasil filter tidak disimpan di state, tapi dihitung ulang tiap render.
  const filtered = products.filter((product) => {
    const matchName = product.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === '' || product.category === categoryFilter;
    const matchStatus = statusFilter === '' || product.status === statusFilter;

    return matchName && matchCategory && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  // kalau filter berubah, balik ke halaman 1 supaya tidak nyangkut di halaman kosong
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter]);

  const hasFilter = search !== '' || categoryFilter !== '' || statusFilter !== '';

  return (
    <div className="page">
      <header className="header">
        <h1>Product Dashboard</h1>
        <span className="count">
          {products.length} products
          {USING_LOCAL_DATA && <span className="tag">local data</span>}
        </span>
      </header>

      {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}

      <div className="toolbar">
        <input
          type="search"
          className="search"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {hasFilter && (
          <button
            className="btn"
            onClick={() => {
              setSearch('');
              setCategoryFilter('');
              setStatusFilter('');
            }}
          >
            Reset filters
          </button>
        )}

        <button
          className="btn primary add"
          onClick={() => {
            setSelected(null);
            setModal('add');
          }}
        >
          + Add Product
        </button>
      </div>

      <div className="panel">
        {loading && (
          <div className="skeleton">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="skeleton-row" />
            ))}
          </div>
        )}

        {!loading && loadError && (
          <div className="empty">
            <strong>Could not load products</strong>
            <p>{loadError}</p>
            <button className="btn primary" onClick={loadProducts}>
              Retry
            </button>
          </div>
        )}

        {!loading && !loadError && visible.length === 0 && (
          <div className="empty">
            <strong>No products match your filters</strong>
            <p>Try a different keyword or reset the filters.</p>
          </div>
        )}

        {!loading && !loadError && visible.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => (
                <tr key={product.id}>
                  <td data-label="Name">{product.name}</td>
                  <td data-label="Category">
                    <span className="badge">{product.category}</span>
                  </td>
                  <td data-label="Price">{formatPrice(product.price)}</td>
                  <td data-label="Status">
                    <span
                      className={
                        product.status === 'In Stock' ? 'badge green' : 'badge red'
                      }
                    >
                      {product.status}
                    </span>
                  </td>
                  <td data-label="Created">{formatDate(product.createdAt)}</td>
                  <td data-label="Actions">
                    <div className="row-actions">
                      <button
                        className="btn small"
                        onClick={() => {
                          setSelected(product);
                          setModal('view');
                        }}
                      >
                        View
                      </button>
                      <button
                        className="btn small"
                        onClick={() => {
                          setSelected(product);
                          setModal('edit');
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn small danger"
                        onClick={() => {
                          setSelected(product);
                          setModal('delete');
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !loadError && totalPages > 1 && (
          <div className="pagination">
            <button className="btn" onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {modal === 'view' && selected && (
        <Modal title="Product Details" onClose={closeModal}>
          <dl className="detail">
            <dt>Name</dt>
            <dd>{selected.name}</dd>
            <dt>Category</dt>
            <dd>{selected.category}</dd>
            <dt>Price</dt>
            <dd>{formatPrice(selected.price)}</dd>
            <dt>Status</dt>
            <dd>{selected.status}</dd>
            <dt>Created</dt>
            <dd>{formatDate(selected.createdAt)}</dd>
          </dl>

          <div className="actions-right">
            <button className="btn" onClick={closeModal}>
              Close
            </button>
            <button className="btn primary" onClick={() => setModal('edit')}>
              Edit
            </button>
          </div>
        </Modal>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'edit' ? 'Edit Product' : 'Add Product'} onClose={closeModal}>
          <ProductForm
            product={modal === 'edit' ? selected : null}
            onSubmit={modal === 'edit' ? handleEdit : handleAdd}
            onCancel={closeModal}
            saving={saving}
          />
        </Modal>
      )}

      {modal === 'delete' && selected && (
        <Modal title="Delete Product" onClose={closeModal}>
          <p>
            Are you sure you want to delete <strong>{selected.name}</strong>?
          </p>

          <div className="actions-right">
            <button className="btn" onClick={closeModal} disabled={saving}>
              Cancel
            </button>
            <button className="btn danger" onClick={handleDelete} disabled={saving}>
              {saving ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="overlay" onClick={onClose}>
      {/* stopPropagation supaya klik di dalam kotak tidak menutup modalnya */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
