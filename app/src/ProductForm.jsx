import { useState } from 'react';
import { CATEGORIES, STATUSES, validateProduct } from './helpers.js';

// Form ini dipakai untuk tambah dan edit sekaligus.
// Kalau prop product null berarti mode tambah, kalau ada isinya berarti edit.
export default function ProductForm({ product, onSubmit, onCancel, saving }) {
  const [values, setValues] = useState({
    name: product ? product.name : '',
    category: product ? product.category : '',
    price: product ? product.price : '',
    status: product ? product.status : 'In Stock',
  });

  // field yang sudah pernah diklik lalu ditinggalkan user
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = validateProduct(values);
  const valid = Object.keys(errors).length === 0;

  // Error baru ditampilkan setelah field disentuh atau submit ditekan,
  // biar form tidak langsung merah begitu dibuka.
  function errorOf(field) {
    return touched[field] || submitted ? errors[field] : undefined;
  }

  function change(field, value) {
    setValues({ ...values, [field]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);

    if (!valid) return;

    onSubmit({
      name: values.name.trim(),
      category: values.category,
      price: Number(values.price),
      status: values.status,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={values.name}
          onChange={(e) => change('name', e.target.value)}
          onBlur={() => setTouched({ ...touched, name: true })}
          placeholder="Wireless Mechanical Keyboard"
          className={errorOf('name') ? 'invalid' : ''}
        />
        {errorOf('name') && <p className="error">{errors.name}</p>}
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={values.category}
          onChange={(e) => change('category', e.target.value)}
          onBlur={() => setTouched({ ...touched, category: true })}
          className={errorOf('category') ? 'invalid' : ''}
        >
          <option value="">Choose a category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errorOf('category') && <p className="error">{errors.category}</p>}
      </div>

      <div className="field">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          value={values.price}
          onChange={(e) => change('price', e.target.value)}
          onBlur={() => setTouched({ ...touched, price: true })}
          placeholder="1250000"
          className={errorOf('price') ? 'invalid' : ''}
        />
        {errorOf('price') && <p className="error">{errors.price}</p>}
      </div>

      <div className="field">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={values.status}
          onChange={(e) => change('status', e.target.value)}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="actions-right">
        <button type="button" className="btn" onClick={onCancel} disabled={saving}>
          Cancel
        </button>

        {/* dimatikan kalau form belum valid, atau requestnya masih jalan */}
        <button type="submit" className="btn primary" disabled={!valid || saving}>
          {saving ? 'Saving...' : product ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}
