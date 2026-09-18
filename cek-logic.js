// Cetak hasil tiap fungsi ke terminal supaya bisa dibandingkan sendiri.
//   node cek-logic.js

import { countCharacterFrequency, processUserData } from './logic-assessment.js';

console.log('countCharacterFrequency');
console.log(countCharacterFrequency('Hello, World!'), '<- { h:1, e:1, l:3, o:2, w:1, r:1, d:1 }');
console.log(countCharacterFrequency('a1 b2! a3?'), '<- { a:2, b:1 }');
console.log(countCharacterFrequency('AaAa'), '<- { a:4 }');
console.log(countCharacterFrequency(null), '<- {}');

const users = [
  { id: 1, name: 'Andi', age: 25, gender: 'male' },
  { id: 2, name: 'Budi', age: 30, gender: 'male' },
  { id: 3, name: 'Citra', age: 17, gender: 'female' },
  { id: 4, name: 'Dewi', age: 28, gender: 'female' },
  { id: 5, name: 'Eka', age: 34, gender: 'female' },
  { id: 6, name: 'Fani', age: 32, gender: 'female' },
];

console.log('\nprocessUserData');
console.dir(processUserData(users), { depth: null });
console.log('male harusnya count 2 averageAge 27.5');
console.log('female harusnya count 3 averageAge 31.3');

console.log('\nCitra (17 tahun) harus hilang dari hasil di atas.');
console.log('Array kosong:', processUserData([]));
console.log('Bukan array:', processUserData(null));
