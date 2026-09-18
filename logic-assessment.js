// Part 1 - Logic & Data Manipulation

// Menghitung berapa kali tiap huruf muncul dalam sebuah string.
// "Hello, World!" -> { h: 1, e: 1, l: 3, o: 2, w: 1, r: 1, d: 1 }
function countCharacterFrequency(text) {
  if (typeof text !== 'string') return {};

  const result = {};

  for (const char of text.toLowerCase()) {
    // lewati spasi, angka, dan tanda baca
    if (char < 'a' || char > 'z') continue;

    result[char] = (result[char] || 0) + 1;
  }

  return result;
}

// Buang user di bawah 18 tahun kemudian kelompokkan sisanya berdasarkan gender.
// setelah itu hitung jumlah dan rata-rata umurnya.
function processUserData(users) {
  if (!Array.isArray(users)) return {};

  const groups = {};

  for (const user of users) {
    if (!user || typeof user.age !== 'number') continue;
    if (user.age < 18) continue;

    const gender = user.gender ? user.gender.toLowerCase() : 'unknown';

    if (!groups[gender]) groups[gender] = [];

    // disalin dulu supaya data yang dikirim pemanggil tidak ikut berubah
    groups[gender].push({ ...user });
  }

  const result = {};

  for (const gender in groups) {
    const members = groups[gender];

    let totalAge = 0;
    for (const user of members) {
      totalAge += user.age;
    }

    const average = totalAge / members.length;

    result[gender] = {
      count: members.length,
      averageAge: Math.round(average * 10) / 10,
      users: members,
    };
  }

  return result;
}

export { countCharacterFrequency, processUserData };
