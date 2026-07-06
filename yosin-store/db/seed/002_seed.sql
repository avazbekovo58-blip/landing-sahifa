-- =============================================================
-- Yosin Store — demo seed data (migration 002)
-- Rich, varied catalog so the free demo looks full and premium.
-- Product types intentionally mixed (clothes + electronics + books)
-- to prove the universal variant/attribute model.
-- Images use Unsplash source URLs (swap for real images in production).
-- =============================================================

BEGIN;

-- ---------- settings ----------
INSERT INTO settings (key, value) VALUES
    ('shop_name',     'Yosin Store'),
    ('logo_url',      ''),
    ('currency',      'so''m'),
    ('delivery_info', 'Toshkent bo''ylab 1-2 kun ichida bepul yetkazib berish'),
    ('admin_chat_id', ''),
    ('languages',     'uz,ru')
ON CONFLICT (key) DO NOTHING;

-- ---------- demo users ----------
INSERT INTO users (id, name, username, phone, lang) VALUES
    (1001, 'Demo Mijoz',  'demo_user',  '+998901112233', 'uz'),
    (1002, 'Aziz Karimov','aziz_k',     '+998907778899', 'uz')
ON CONFLICT (id) DO NOTHING;

-- ---------- categories ----------
INSERT INTO categories (id, parent_id, name, slug, icon, position) VALUES
    (1, NULL, 'Kiyim',       'kiyim',       '👕', 1),
    (2, NULL, 'Elektronika', 'elektronika', '📱', 2),
    (3, NULL, 'Kitoblar',    'kitoblar',    '📚', 3)
ON CONFLICT (id) DO NOTHING;
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- ---------- products ----------
INSERT INTO products (id, category_id, name, description, base_price, brand) VALUES
    (1, 1, 'Klassik oq futbolka', 'Yumshoq 100% paxta, kundalik kiyim uchun ideal. Nafas oladigan mato.', 89000,  'Yosin Basics'),
    (2, 1, 'Denim jinsi shim',    'Zamonaviy slim-fit, mustahkam denim. Har qanday uslubga mos.',           219000, 'Yosin Denim'),
    (3, 1, 'Yengil ko''ylagi',    'Kuz-bahor uchun yengil ko''ylak, klassik kesim.',                        175000, 'Yosin Basics'),
    (4, 1, 'Sport krossovka',     'Yengil va qulay, kundalik yurishlar uchun amortizatsiyali taglik.',      349000, 'Yosin Sport'),
    (5, 2, 'Smartfon Aurora X',   'AMOLED ekran, uzoq batareya, kuchli protsessor. Kunlik ishlar uchun a''lo.', 3990000, 'Aurora'),
    (6, 2, 'Simsiz quloqchin Pro','Faol shovqin bostirish, 30 soat ishlash muddati, tez zaryad.',           690000, 'SoundOne'),
    (7, 2, 'Aqlli soat Fit 2',    'Yurak ritmi, uyqu va faollik monitoringi. Suvga chidamli.',              890000, 'FitWear'),
    (8, 2, 'Quvvat banki 20000',  '20000mAh, tez zaryad, ikkita USB chiqish.',                              249000, 'PowerMax'),
    (9, 3, 'O''tkan kunlar',      'Abdulla Qodiriy — o''zbek adabiyotining durdona romani.',                55000,  'Yosin Nashr'),
    (10,3, 'Atom odatlar',        'James Clear — kichik odatlar orqali katta natijalar.',                   79000,  'Yosin Nashr'),
    (11,3, 'Sapiens',             'Yuval Noah Harari — insoniyat qisqacha tarixi.',                         98000,  'Yosin Nashr'),
    (12,3, 'Boy ota, kambag''al ota','Robert Kiyosaki — moliyaviy savodxonlik asoslari.',                   72000,  'Yosin Nashr')
ON CONFLICT (id) DO NOTHING;
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- ---------- product_images ----------
INSERT INTO product_images (product_id, url, position) VALUES
    (1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 0),
    (1, 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&q=80', 1),
    (2, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', 0),
    (3, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80', 0),
    (4, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 0),
    (5, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', 0),
    (5, 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=800&q=80', 1),
    (6, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80', 0),
    (7, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80', 0),
    (8, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80', 0),
    (9, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80', 0),
    (10,'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80', 0),
    (11,'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80', 0),
    (12,'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80', 0)
ON CONFLICT DO NOTHING;

-- ---------- product_variants (with old_price for discount badges) ----------
INSERT INTO product_variants (product_id, name, price, old_price, stock, sku) VALUES
    -- futbolka: size / color
    (1, 'S / Oq',   89000,  109000, 25, 'TS-S-W'),
    (1, 'M / Oq',   89000,  109000, 40, 'TS-M-W'),
    (1, 'L / Oq',   89000,  NULL,   30, 'TS-L-W'),
    (1, 'M / Qora', 95000,  NULL,   18, 'TS-M-B'),
    -- jinsi
    (2, '30', 219000, 259000, 12, 'JN-30'),
    (2, '32', 219000, 259000, 20, 'JN-32'),
    (2, '34', 219000, NULL,   9,  'JN-34'),
    -- ko'ylak
    (3, 'M', 175000, NULL, 15, 'SH-M'),
    (3, 'L', 175000, NULL, 11, 'SH-L'),
    -- krossovka
    (4, '41', 349000, 429000, 8,  'SN-41'),
    (4, '42', 349000, 429000, 14, 'SN-42'),
    (4, '43', 349000, NULL,   6,  'SN-43'),
    -- smartfon: memory / color
    (5, '128GB / Qora', 3990000, 4490000, 7, 'PH-128-B'),
    (5, '256GB / Qora', 4490000, NULL,    5, 'PH-256-B'),
    (5, '256GB / Ko''k', 4490000, NULL,    3, 'PH-256-C'),
    -- quloqchin
    (6, 'Qora', 690000, 790000, 22, 'HP-B'),
    (6, 'Oq',   690000, 790000, 16, 'HP-W'),
    -- soat
    (7, 'Qora', 890000, NULL, 13, 'WT-B'),
    (7, 'Kumush',890000, NULL, 9,  'WT-S'),
    -- power bank
    (8, '20000mAh', 249000, 299000, 30, 'PB-20'),
    -- kitoblar: format
    (9,  'Qattiq muqova', 55000, NULL, 40, 'BK-9-H'),
    (9,  'Yumshoq muqova',45000, NULL, 25, 'BK-9-S'),
    (10, 'Qattiq muqova', 79000, 95000, 35, 'BK-10-H'),
    (11, 'Qattiq muqova', 98000, NULL, 20, 'BK-11-H'),
    (12, 'Qattiq muqova', 72000, 89000, 28, 'BK-12-H')
ON CONFLICT DO NOTHING;

-- ---------- product_attributes (flexible specs per product type) ----------
INSERT INTO product_attributes (product_id, attr_key, attr_value) VALUES
    (1, 'Material', '100% paxta'), (1, 'Mavsum', 'Butun yil'), (1, 'Yuvish', '30°C mashinada'),
    (2, 'Material', 'Denim'),      (2, 'Kesim', 'Slim fit'),
    (4, 'Taglik', 'Rezina'),       (4, 'Vazn', '280g'),
    (5, 'Ekran', '6.5" AMOLED'),   (5, 'RAM', '8GB'), (5, 'Batareya', '5000mAh'), (5, 'Kamera', '108MP'),
    (6, 'Ulanish', 'Bluetooth 5.3'),(6, 'Batareya', '30 soat'), (6, 'Shovqin bostirish', 'Faol (ANC)'),
    (7, 'Ekran', '1.4" AMOLED'),   (7, 'Suvga chidamlilik', '5ATM'),
    (8, 'Sig''im', '20000mAh'),    (8, 'Chiqish', '2x USB-A, 1x USB-C'),
    (9, 'Muallif', 'Abdulla Qodiriy'), (9, 'Sahifa', '384'), (9, 'Til', 'O''zbek'),
    (10,'Muallif', 'James Clear'),     (10,'Sahifa', '320'), (10,'Til', 'O''zbek'),
    (11,'Muallif', 'Yuval Noah Harari'),(11,'Sahifa', '443'),(11,'Til', 'O''zbek'),
    (12,'Muallif', 'Robert Kiyosaki'), (12,'Sahifa', '256'), (12,'Til', 'O''zbek')
ON CONFLICT DO NOTHING;

-- ---------- reviews ----------
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
    (1, 1001, 5, 'Juda sifatli, mato yoqadi.'),
    (1, 1002, 4, 'Yaxshi, lekin biroz kichik keldi.'),
    (5, 1001, 5, 'Ekrani zo''r, batareyasi uzoq.'),
    (5, 1002, 5, 'Narxiga arziydi.'),
    (10,1001, 5, 'Hayotimni o''zgartirgan kitob.'),
    (6, 1002, 4, 'Shovqin bostirish kuchli.')
ON CONFLICT DO NOTHING;

-- ---------- demo orders ----------
INSERT INTO orders (id, user_id, status, total, address, phone, payment_method) VALUES
    (1, 1001, 'delivered', 308000,  'Toshkent, Chilonzor 5-kvartal', '+998901112233', 'cash'),
    (2, 1001, 'shipping',  690000,  'Toshkent, Yunusobod',           '+998901112233', 'cash')
ON CONFLICT (id) DO NOTHING;
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));

INSERT INTO order_items (order_id, variant_id, product_name, quantity, price) VALUES
    (1, 2, 'Klassik oq futbolka (M / Oq)', 1, 89000),
    (1, 5, 'Denim jinsi shim (30)',        1, 219000),
    (2, 15,'Simsiz quloqchin Pro (Qora)',  1, 690000)
ON CONFLICT DO NOTHING;

COMMIT;
