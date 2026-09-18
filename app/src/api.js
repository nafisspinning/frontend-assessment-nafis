// Semua request ke my-json-server ada di file ini, jadi komponen React
// tidak perlu tahu datanya datang dari mana.
//
// Kalau VITE_API_URL diisi di .env, request dikirim ke my-json-server.
// Kalau kosong, dipakai salinan db.json di bawah ini supaya app tetap bisa
// dibuka tanpa koneksi.

const BASE_URL = import.meta.env.VITE_API_URL || '';

export const USING_LOCAL_DATA = BASE_URL === '';

let products = [
  {
    id: 1,
    name: 'Wireless Mechanical Keyboard',
    category: 'Electronics',
    price: 1250000,
    status: 'In Stock',
    createdAt: '2024-01-15T09:30:00.000Z',
  },
  {
    id: 2,
    name: 'Ceramic Pour-Over Coffee Set',
    category: 'Home & Kitchen',
    price: 350000,
    status: 'In Stock',
    createdAt: '2024-02-02T14:10:00.000Z',
  },
  {
    id: 3,
    name: 'Running Shoes — Trail Edition',
    category: 'Apparel',
    price: 1450000,
    status: 'Out of Stock',
    createdAt: '2024-03-11T11:45:00.000Z',
  },
  {
    id: 4,
    name: 'Minimalist Desk Lamp',
    category: 'Home & Kitchen',
    price: 425000,
    status: 'In Stock',
    createdAt: '2024-04-20T08:00:00.000Z',
  },
];

let nextId = 5;

// Ditunda sebentar supaya loading skeleton-nya kelihatan seperti nunggu server.
function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), 600));
}

export async function getProducts() {
  if (USING_LOCAL_DATA) return delay([...products]);

  const res = await fetch(`${BASE_URL}/products`);

  // fetch tidak otomatis error untuk status 404 atau 500, jadi dicek manual
  if (!res.ok) throw new Error(`Failed to load products (${res.status})`);

  return res.json();
}

export async function createProduct(data) {
  if (USING_LOCAL_DATA) {
    const created = { ...data, id: nextId++ };
    products = [created, ...products];
    return delay(created);
  }

  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to create product');

  return res.json();
}

export async function updateProduct(id, data) {
  if (USING_LOCAL_DATA) {
    let updated = null;

    products = products.map((product) => {
      if (product.id !== id) return product;
      updated = { ...product, ...data };
      return updated;
    });

    return delay(updated);
  }

  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to update product');

  return res.json();
}

export async function deleteProduct(id) {
  if (USING_LOCAL_DATA) {
    products = products.filter((product) => product.id !== id);
    return delay(null);
  }

  const res = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });

  if (!res.ok) throw new Error('Failed to delete product');

  return null;
}
