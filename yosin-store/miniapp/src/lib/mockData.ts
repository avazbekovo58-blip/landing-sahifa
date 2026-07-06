// Demo catalog for the free, backend-less demo. Mirrors db/seed/002_seed.sql.
// When VITE_API_BASE is set, the real API replaces all of this (see api.ts).
import type { Category, Product, Order, Me, Settings } from './types';

export const CURRENCY = "so'm";

export const SETTINGS: Settings = {
  shop_name: 'Yosin Store',
  currency: CURRENCY,
  delivery_info: "Toshkent bo'ylab 1-2 kun ichida bepul yetkazib berish",
};

export const ME: Me = {
  id: 1001,
  name: 'Demo Mijoz',
  username: 'demo_user',
  phone: '+998 90 111 22 33',
  lang: 'uz',
};

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Kiyim', slug: 'kiyim', icon: '👕' },
  { id: 2, name: 'Elektronika', slug: 'elektronika', icon: '📱' },
  { id: 3, name: 'Kitoblar', slug: 'kitoblar', icon: '📚' },
];

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

export const PRODUCTS: Product[] = [
  {
    id: 1, category_id: 1, name: 'Klassik oq futbolka', brand: 'Yosin Basics',
    description: 'Yumshoq 100% paxta, kundalik kiyim uchun ideal. Nafas oladigan mato, mustahkam tikuv.',
    images: [img('1521572163474-6864f9cf17ab'), img('1622445275576-721325763afe')],
    variants: [
      { id: 1, name: 'S / Oq', price: 89000, old_price: 109000, stock: 25 },
      { id: 2, name: 'M / Oq', price: 89000, old_price: 109000, stock: 40 },
      { id: 3, name: 'L / Oq', price: 89000, stock: 30 },
      { id: 4, name: 'M / Qora', price: 95000, stock: 18 },
    ],
    attributes: [
      { key: 'Material', value: '100% paxta' }, { key: 'Mavsum', value: 'Butun yil' },
      { key: 'Yuvish', value: '30°C mashinada' },
    ],
    rating: 4.5, reviews_count: 2,
  },
  {
    id: 2, category_id: 1, name: 'Denim jinsi shim', brand: 'Yosin Denim',
    description: 'Zamonaviy slim-fit, mustahkam denim. Har qanday uslubga mos keladi.',
    images: [img('1542272604-787c3835535d')],
    variants: [
      { id: 5, name: '30', price: 219000, old_price: 259000, stock: 12 },
      { id: 6, name: '32', price: 219000, old_price: 259000, stock: 20 },
      { id: 7, name: '34', price: 219000, stock: 9 },
    ],
    attributes: [{ key: 'Material', value: 'Denim' }, { key: 'Kesim', value: 'Slim fit' }],
    rating: 4.7, reviews_count: 0,
  },
  {
    id: 3, category_id: 1, name: "Yengil ko'ylagi", brand: 'Yosin Basics',
    description: "Kuz-bahor uchun yengil ko'ylak, klassik kesim.",
    images: [img('1596755094514-f87e34085b2c')],
    variants: [
      { id: 8, name: 'M', price: 175000, stock: 15 },
      { id: 9, name: 'L', price: 175000, stock: 11 },
    ],
    attributes: [{ key: 'Material', value: 'Paxta aralash' }, { key: 'Mavsum', value: 'Kuz-bahor' }],
    rating: 4.3, reviews_count: 0,
  },
  {
    id: 4, category_id: 1, name: 'Sport krossovka', brand: 'Yosin Sport',
    description: 'Yengil va qulay, kundalik yurishlar uchun amortizatsiyali taglik.',
    images: [img('1542291026-7eec264c27ff')],
    variants: [
      { id: 10, name: '41', price: 349000, old_price: 429000, stock: 8 },
      { id: 11, name: '42', price: 349000, old_price: 429000, stock: 14 },
      { id: 12, name: '43', price: 349000, stock: 6 },
    ],
    attributes: [{ key: 'Taglik', value: 'Rezina' }, { key: 'Vazn', value: '280g' }],
    rating: 4.6, reviews_count: 0,
  },
  {
    id: 5, category_id: 2, name: 'Smartfon Aurora X', brand: 'Aurora',
    description: "AMOLED ekran, uzoq batareya, kuchli protsessor. Kunlik ishlar uchun a'lo tanlov.",
    images: [img('1511707171634-5f897ff02aa9'), img('1592286927505-1def25115558')],
    variants: [
      { id: 13, name: '128GB / Qora', price: 3990000, old_price: 4490000, stock: 7 },
      { id: 14, name: '256GB / Qora', price: 4490000, stock: 5 },
      { id: 15, name: "256GB / Ko'k", price: 4490000, stock: 3 },
    ],
    attributes: [
      { key: 'Ekran', value: '6.5" AMOLED' }, { key: 'RAM', value: '8GB' },
      { key: 'Batareya', value: '5000mAh' }, { key: 'Kamera', value: '108MP' },
    ],
    rating: 5, reviews_count: 2,
  },
  {
    id: 6, category_id: 2, name: 'Simsiz quloqchin Pro', brand: 'SoundOne',
    description: 'Faol shovqin bostirish, 30 soat ishlash muddati, tez zaryad.',
    images: [img('1606220945770-b5b6c2c55bf1')],
    variants: [
      { id: 16, name: 'Qora', price: 690000, old_price: 790000, stock: 22 },
      { id: 17, name: 'Oq', price: 690000, old_price: 790000, stock: 16 },
    ],
    attributes: [
      { key: 'Ulanish', value: 'Bluetooth 5.3' }, { key: 'Batareya', value: '30 soat' },
      { key: 'Shovqin bostirish', value: 'Faol (ANC)' },
    ],
    rating: 4.4, reviews_count: 1,
  },
  {
    id: 7, category_id: 2, name: 'Aqlli soat Fit 2', brand: 'FitWear',
    description: 'Yurak ritmi, uyqu va faollik monitoringi. Suvga chidamli korpus.',
    images: [img('1579586337278-3befd40fd17a')],
    variants: [
      { id: 18, name: 'Qora', price: 890000, stock: 13 },
      { id: 19, name: 'Kumush', price: 890000, stock: 9 },
    ],
    attributes: [{ key: 'Ekran', value: '1.4" AMOLED' }, { key: 'Suvga chidamlilik', value: '5ATM' }],
    rating: 4.5, reviews_count: 0,
  },
  {
    id: 8, category_id: 2, name: 'Quvvat banki 20000', brand: 'PowerMax',
    description: '20000mAh sig‘im, tez zaryad, ikkita USB chiqish.',
    images: [img('1609091839311-d5365f9ff1c5')],
    variants: [{ id: 20, name: '20000mAh', price: 249000, old_price: 299000, stock: 30 }],
    attributes: [{ key: "Sig'im", value: '20000mAh' }, { key: 'Chiqish', value: '2x USB-A, 1x USB-C' }],
    rating: 4.2, reviews_count: 0,
  },
  {
    id: 9, category_id: 3, name: "O'tkan kunlar", brand: 'Yosin Nashr',
    description: "Abdulla Qodiriy — o'zbek adabiyotining durdona romani.",
    images: [img('1544947950-fa07a98d237f')],
    variants: [
      { id: 21, name: 'Qattiq muqova', price: 55000, stock: 40 },
      { id: 22, name: 'Yumshoq muqova', price: 45000, stock: 25 },
    ],
    attributes: [{ key: 'Muallif', value: 'Abdulla Qodiriy' }, { key: 'Sahifa', value: '384' }, { key: 'Til', value: "O'zbek" }],
    rating: 5, reviews_count: 0,
  },
  {
    id: 10, category_id: 3, name: 'Atom odatlar', brand: 'Yosin Nashr',
    description: 'James Clear — kichik odatlar orqali katta natijalar.',
    images: [img('1589998059171-988d887df646')],
    variants: [{ id: 23, name: 'Qattiq muqova', price: 79000, old_price: 95000, stock: 35 }],
    attributes: [{ key: 'Muallif', value: 'James Clear' }, { key: 'Sahifa', value: '320' }, { key: 'Til', value: "O'zbek" }],
    rating: 5, reviews_count: 1,
  },
  {
    id: 11, category_id: 3, name: 'Sapiens', brand: 'Yosin Nashr',
    description: 'Yuval Noah Harari — insoniyat qisqacha tarixi.',
    images: [img('1512820790803-83ca734da794')],
    variants: [{ id: 24, name: 'Qattiq muqova', price: 98000, stock: 20 }],
    attributes: [{ key: 'Muallif', value: 'Yuval Noah Harari' }, { key: 'Sahifa', value: '443' }, { key: 'Til', value: "O'zbek" }],
    rating: 4.8, reviews_count: 0,
  },
  {
    id: 12, category_id: 3, name: "Boy ota, kambag'al ota", brand: 'Yosin Nashr',
    description: 'Robert Kiyosaki — moliyaviy savodxonlik asoslari.',
    images: [img('1543002588-bfa74002ed7e')],
    variants: [{ id: 25, name: 'Qattiq muqova', price: 72000, old_price: 89000, stock: 28 }],
    attributes: [{ key: 'Muallif', value: 'Robert Kiyosaki' }, { key: 'Sahifa', value: '256' }, { key: 'Til', value: "O'zbek" }],
    rating: 4.6, reviews_count: 0,
  },
];

export const ORDERS: Order[] = [
  {
    id: 1, status: 'delivered', total: 308000, address: 'Toshkent, Chilonzor 5-kvartal',
    phone: '+998 90 111 22 33', payment_method: 'cash', created_at: '2026-06-18T10:00:00Z',
    items: [
      { product_name: 'Klassik oq futbolka (M / Oq)', quantity: 1, price: 89000 },
      { product_name: 'Denim jinsi shim (30)', quantity: 1, price: 219000 },
    ],
  },
  {
    id: 2, status: 'shipping', total: 690000, address: 'Toshkent, Yunusobod',
    phone: '+998 90 111 22 33', payment_method: 'cash', created_at: '2026-07-02T14:30:00Z',
    items: [{ product_name: 'Simsiz quloqchin Pro (Qora)', quantity: 1, price: 690000 }],
  },
];
