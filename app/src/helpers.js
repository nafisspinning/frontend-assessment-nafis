export const CATEGORIES = ['Electronics', 'Home & Kitchen', 'Apparel'];

export const STATUSES = ['In Stock', 'Out of Stock'];

export const PAGE_SIZE = 5;

// 1250000 -> "Rp1.250.000"
export function formatPrice(value) {
  if (typeof value !== 'number') return '-';

  const text = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

  // Intl menghasilkan "Rp 1.250.000", spasinya dibuang
  return text.replace(/\s/g, '');
}

// "2024-01-15T09:30:00.000Z" -> "Jan 15, 2024"
export function formatDate(value) {
  if (!value) return '-';

  const date = new Date(value);
  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

// Mengembalikan object berisi pesan error per field.
// Kalau object-nya kosong, berarti form valid.
export function validateProduct(values) {
  const errors = {};

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Name is required.';
  }

  if (!values.category) {
    errors.category = 'Please choose a category.';
  }

  if (values.price === '') {
    errors.price = 'Price is required.';
  } else if (isNaN(Number(values.price))) {
    errors.price = 'Price must be a number.';
  } else if (Number(values.price) <= 0) {
    errors.price = 'Price must be greater than 0.';
  }

  return errors;
}
