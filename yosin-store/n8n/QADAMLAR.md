# n8n — qadama-qadam qo'llanma (sodda til)

Bu fayl n8n backendni noldan qurishni oddiy tilda tushuntiradi. Har bir qadam alohida —
biror qadamni tugatib, ishlayotganini tekshirib, keyingisiga o'tamiz.

## n8n nima? (bir gapda)
n8n — bu "bloklardan avtomatlashtirish" quradigan vosita. Har bir blok = **node**. Nodelarni
bir-biriga ulab (masalan: Telegram'dan xabar keldi → bazaga yozdi → javob qaytardi) katta
ishlarni ko'p kod yozmasdan qilasiz. Bizda 3 narsa n8n ichida bo'ladi: Telegram bot,
AI yordamchi, va Mini App uchun API.

## Umumiy reja (qadamlar)
1. **n8n'ni ishga tushirish va ochish** ← hozir shu yerdamiz
2. Credential (ulanish kalitlari) qo'shish — Postgres, Telegram, Anthropic
3. Birinchi workflow: Telegram bot `/start` ga javob bersin + Mini App tugmasi
4. AI Agent (Claude) qo'shish — mijoz bilan gaplashsin
5. AI uchun tool'lar (mahsulot qidirish, savatga qo'shish, buyurtma…)
6. Mini App API webhook'lari (`/api/...`) + initData tekshiruvi
7. Admin bildirishnoma + savol eskalatsiyasi + bloklash

---

## 1-QADAM — n8n'ni ishga tushirish va ochish

**Maqsad:** n8n brauzerda ochilsin va ishlashga tayyor bo'lsin.

### 1.1. `.env` faylini to'ldirish
Loyiha papkasida (`yosin-store/`) `.env.example` dan nusxa oling:
```bash
cp .env.example .env
```
`.env` ichida kamida shularni to'ldiring:
- `DOMAIN` — sizning domeningiz (test uchun hozircha `localhost` ham bo'ladi)
- `POSTGRES_PASSWORD` — kuchli parol o'ylab yozing
- `N8N_ENCRYPTION_KEY` — terminalda `openssl rand -hex 24` buyrug'i beradigan qatorni qo'ying
- `BOT_TOKEN`, `ANTHROPIC_API_KEY` — bularni keyingi qadamlarda ishlatamiz, hozir bo'sh bo'lsa ham mayli

### 1.2. Stack'ni ko'tarish
Loyiha papkasida:
```bash
docker compose up -d
```
Bu 3 narsani yoqadi: **postgres** (baza — schema va demo ma'lumot avtomatik yuklanadi),
**n8n**, va **caddy** (HTTPS + Mini App). Birinchi marta biroz vaqt oladi (image'lar yuklanadi).

Ishlayotganini tekshirish:
```bash
docker compose ps
```
Uchala xizmat `running` (yoki `healthy`) bo'lsa — yaxshi.

### 1.3. n8n'ni ochish
Brauzerda oching (test uchun eng oson yo'l):

**`http://localhost:5678/`**

> Bu ishlashi uchun `docker-compose.yml` da n8n `5678` portini ochishi kerak — bu allaqachon
> sozlangan (`ports: - "5678:5678"`). Agar `localhost:5678` ochilmasa: `docker compose ps` da
> n8n `running` ekanini tekshiring, va `docker compose logs n8n` ga qarang.

VPS'da (haqiqiy domen bilan) ishlaganda n8n internetga ochiq turmasligi uchun portni
faqat localhostga bog'lang (`127.0.0.1:5678:5678`) va SSH-tunnel orqali kiring:
```bash
ssh -L 5678:127.0.0.1:5678 user@<vps-ip>
```
so'ng o'z brauzeringizda yana `http://localhost:5678/`.

Birinchi kirishda n8n **admin akkaunt** so'raydi (email + parol). Bu n8n'ning o'z egasi
akkaunti — o'ylab yozing va saqlab qo'ying.

### 1.4. Tekshirish ✅
Ichkariga kirgach bo'sh ishchi maydon ("Add first step" tugmasi bilan) ochilsa — 1-qadam
tayyor. Hali hech narsa qurmadik, faqat n8n tayyor turibdi.

> **Muammo bo'lsa:** `docker compose logs n8n` — n8n loglarini ko'rsatadi.
> `docker compose logs postgres` — baza loglarini. Ko'pincha xato `.env` da bo'ladi.
