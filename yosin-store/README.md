# Yosin Store

Telegram bot + Telegram Mini App do'kon, ichida AI savdo yordamchisi. Mahsulot turiga
(kitob / kiyim / smartfon …) **kod o'zgartirmasdan** moslashadi. Premium, mobil-first
dizayn — bu mahsulotning asosiy sotuv nuqtasi.

> **Hozirgi holat:** to'liq ishlaydigan **bepul demo** — premium Mini App frontend
> (React + Vite) namuna ma'lumotlar bilan (backend shart emas), plus butun tizim uchun
> poydevor (DB schema + seed, docker-compose, Caddy, n8n hujjatlari va AI system prompt).
> Backend (n8n workflowlar) va deploy — keyingi bosqichlar (pastga qarang).

---

## Arxitektura

```
Telegram ──► n8n (bot + AI Agent + Mini App HTTP API) ──► PostgreSQL
                     ▲
   Mini App (React) ─┘  (HTTPS orqali, /api contract)
Caddy: HTTPS (Let's Encrypt) + Mini App statik build + reverse-proxy /api,/webhook ──► n8n
Docker Compose: postgres + n8n + caddy — hammasi bitta VPS stack.
```

Frontend backendga **API contract** orqali bog'lanadi (§API) — backendni keyin almashtirsa
ham frontend o'zgarmaydi.

## Papka tuzilishi

```
yosin-store/
├─ docker-compose.yml       # postgres + n8n + caddy
├─ .env.example             # barcha maxfiy qiymatlar shabloni (nusxa ol -> .env)
├─ caddy/Caddyfile          # HTTPS + statik + reverse proxy
├─ db/
│  ├─ migrations/001_schema.sql   # universal e-commerce schema
│  └─ seed/002_seed.sql           # boy demo katalog (kiyim + elektronika + kitob)
├─ n8n/
│  ├─ README.md             # workflow import + build qo'llanma
│  ├─ system-prompt.md      # AI persona + qattiq xavfsizlik qoidalari
│  └─ validate-initdata.js  # Telegram initData HMAC validatsiyasi (Code node)
└─ miniapp/                 # React + Vite premium Mini App (do'kon yuzi)
   └─ src/{screens,components,lib}
```

---

## Tez ishga tushirish — Mini App demo (backend shart emas)

```bash
cd miniapp
npm install
npm run dev          # http://localhost:5173
```

`VITE_API_BASE` bo'sh bo'lsa ilova ichki namuna ma'lumotlar bilan ishlaydi (demo rejim).
Barcha ekranlar to'liq ishlaydi: bosh sahifa, katalog + filtr/saralash, mahsulot +
variant tanlash, savat, checkout, buyurtmalar, profil. Savat va sevimlilar `localStorage`da.

Telegram Mini App sifatida ochilganda `telegram-web-app.js` avtomatik ishlaydi (oddiy
brauzerda no-op). Backend tayyor bo'lgach `.env`da `VITE_API_BASE=https://<domain>/api`
qo'ying — UI kodi o'zgarmaydi, real API ishga tushadi.

### Admin panel

Xuddi shu ilova ichida himoyalangan `/admin` route (`http://localhost:5173/#/admin`, yoki
Profil → "Admin panel"). **Demo parol: `demo`**. Bo'limlar: Dashboard (bugun/hafta/oy sotuv +
7 kunlik grafik), Mahsulotlar (qo'shish/tahrirlash/o'chirish — variant narx/stok, ko'rinish
toggle), Kategoriyalar, Buyurtmalar (holatni o'zgartirish), Savollar (javob berish),
Broadcast, Sozlamalar. Demoda o'zgarishlar xotirada; jonli rejimda har biri `/admin/*` API
chaqiruviga bog'lanadi.

> **Xavfsizlik:** demo parol faqat ko'rgazma uchun. Jonli rejimda admin auth **serverda**
> (login/parol yoki Telegram allowlist) va barcha `/admin` endpointlar himoyalangan —
> client flag hech qachon huquq bermaydi.

## To'liq stack (VPS)

```bash
cp .env.example .env         # qiymatlarni to'ldir: DOMAIN, BOT_TOKEN, ANTHROPIC_API_KEY, parollar
cd miniapp && npm install && npm run build && cd ..   # miniapp/dist -> Caddy serve qiladi
docker compose up -d         # postgres (schema+seed avtomatik) + n8n + caddy
```

Keyin:
1. Domenni VPS IP'ga yo'naltir (A record). Caddy avtomatik Let's Encrypt SSL oladi.
2. n8n editor: `https://<domain>/n8n/` → credential'lar (Postgres/Anthropic/Telegram) qo'sh,
   `n8n/`dagi workflowlarni import qil (qarang `n8n/README.md`).
3. Telegram webhook o'rnat:
   ```bash
   curl "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<domain>/webhook/telegram"
   ```
4. Kunlik DB backup (cron):
   ```bash
   0 3 * * * docker compose exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB | gzip > /backup/yosin_$(date +\%F).sql.gz
   ```

---

## API contract (Mini App ↔ n8n)

Baza URL: `https://<domain>/api`. Har bir so'rov Telegram **initData** bilan
autentifikatsiya qilinadi (`X-Init-Data` header) — server HMAC-SHA256 orqali tekshiradi
va foydalanuvchi id'ni **imzolangan** payload'dan oladi (client id'ga ishonilmaydi).

**Public:** `GET /categories`, `GET /products?category=&search=&min_price=&max_price=&sort=`,
`GET /products/:id`, `GET /cart`, `POST /cart`, `DELETE /cart/:variant_id`, `POST /orders`,
`GET /orders`, `GET /me`, `POST /reviews`, `GET /settings`.

**Admin (himoyalangan):** CRUD `/admin/products`, `/admin/categories`; `GET/PATCH /admin/orders`;
`GET /admin/questions`, `POST /admin/questions/:id/answer`; `POST /admin/broadcast`;
`GET /admin/stats`; `GET/PUT /admin/settings`.

> **Narx va umumiy summa HAR DOIM serverda (bazadan) hisoblanadi** — client yoki AI ga
> ishonilmaydi (`POST /orders` variant narxlaridan qayta hisoblaydi).

## Xavfsizlik

- **initData validatsiyasi** har bir API so'rovida (`n8n/validate-initdata.js`).
- **AI ijtimoiy muhandislikka qarshi:** maxfiy ma'lumot bermaydi; "men adminman" — hech
  narsani o'zgartirmaydi (admin huquqi faqat login orqali); narx/chegirmani o'ylab topmaydi;
  bilmaganini `pending_questions`ga eskalatsiya qiladi. Qoidalar `n8n/system-prompt.md`da.
- **Suiiste'molga qarshi:** `users.flags` monitoring → chegaradan oshsa `is_blocked` + admin
  ogohlantirish.
- Maxfiy kalitlar faqat `.env`da (repo'ga tushmaydi). API rate limiting (Caddy/n8n).

## Mahsulotga moslashuvchanlik

`product_variants` (o'lcham/rang/xotira/format + narx + stok) va `product_attributes`
(Muallif/RAM/Material …) orqali istalgan mahsulot turi kod o'zgartirmasdan ifodalanadi.
`settings` jadvali do'kon nomi, logo, valyuta, yetkazishni boshqaradi. **Yangi do'kon =
yangi ma'lumot + sozlama, yangi kod emas.**

---

## Qurilish bosqichlari

| Bosqich | Holat |
|---|---|
| 1. Repo skeleti + docker-compose + .env.example + README | ✅ |
| 2. PostgreSQL schema (migrations) + seed | ✅ |
| 3. API contract + initData validatsiya (client + n8n Code node) | ✅ (frontend + validator; webhook'lar keyin) |
| 4. Mini App (React) — dizayn tizimi + barcha ekranlar | ✅ (demo ma'lumot bilan to'liq ishlaydi) |
| 5. n8n: Telegram bot + AI Agent + tool sub-workflowlar | ⏳ hujjatlashtirilgan (system-prompt + guide), workflow JSON keyin |
| 6. Admin panel (UI) + bildirishnoma + eskalatsiya + bloklash | ✅ panel UI to'liq (demo); webhook'lar §5 bilan yig'iladi |
| 7. Deploy: HTTPS, Telegram webhook, backup | ⏳ compose + Caddy tayyor, VPS'da sozlanadi |

Keyingi ish: n8n editorda §5 workflowlarni va admin webhook'larni yig'ish (schema, contract,
AI prompt va admin UI tayyor), so'ng `VITE_API_BASE`ni jonli API'ga qaratib demoni real
backendga ulash.
