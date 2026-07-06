-- =============================================================
-- Yosin Store — PostgreSQL schema (migration 001)
-- Universal e-commerce schema: works for books, clothes, phones, etc.
-- without code changes (see product_variants + product_attributes).
-- =============================================================

BEGIN;

-- ---------- users ----------
-- id == Telegram user id (BIGINT). We never trust a client-sent id;
-- it is always derived from validated Telegram initData.
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT PRIMARY KEY,
    name        TEXT,
    username    TEXT,
    phone       TEXT,
    lang        TEXT        NOT NULL DEFAULT 'uz',
    is_blocked  BOOLEAN     NOT NULL DEFAULT false,
    flags       INTEGER     NOT NULL DEFAULT 0,   -- abuse / manipulation counter
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- settings (key/value store) ----------
-- Lets a shop owner re-brand without any code change:
-- shop_name, logo_url, currency, delivery_info, admin_chat_id, languages ...
CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT
);

-- ---------- categories (self-referencing tree) ----------
CREATE TABLE IF NOT EXISTS categories (
    id        SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name      TEXT NOT NULL,
    slug      TEXT UNIQUE NOT NULL,
    icon      TEXT,
    position  INTEGER NOT NULL DEFAULT 0
);

-- ---------- products ----------
CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name        TEXT NOT NULL,
    description TEXT,
    base_price  NUMERIC(12,2) NOT NULL DEFAULT 0,
    brand       TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- product_variants ----------
-- Universal purchasable unit: "42 / Qora", "128GB / Ko'k", "Qattiq muqova".
-- Price lives here so size/color/memory can each carry its own price + stock.
CREATE TABLE IF NOT EXISTS product_variants (
    id         SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    price      NUMERIC(12,2) NOT NULL DEFAULT 0,
    old_price  NUMERIC(12,2),                 -- for discount badge; NULL = no discount
    stock      INTEGER NOT NULL DEFAULT 0,
    sku        TEXT
);

-- ---------- product_attributes ----------
-- Flexible spec rows. Book: Muallif/Sahifa/ISBN. Phone: RAM/Ekran. Clothes: Material/Mavsum.
CREATE TABLE IF NOT EXISTS product_attributes (
    id         SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attr_key   TEXT NOT NULL,
    attr_value TEXT
);

-- ---------- product_images ----------
CREATE TABLE IF NOT EXISTS product_images (
    id         SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url        TEXT NOT NULL,
    position   INTEGER NOT NULL DEFAULT 0
);

-- ---------- cart_items ----------
CREATE TABLE IF NOT EXISTS cart_items (
    id         SERIAL PRIMARY KEY,
    user_id    BIGINT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    UNIQUE (user_id, variant_id)
);

-- ---------- orders ----------
CREATE TABLE IF NOT EXISTS orders (
    id             SERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status         TEXT NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new','confirmed','shipping','delivered','cancelled')),
    total          NUMERIC(12,2) NOT NULL DEFAULT 0,  -- recomputed server-side, never trusted from client
    address        TEXT,
    phone          TEXT,
    payment_method TEXT NOT NULL DEFAULT 'cash',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- order_items (snapshot at purchase time) ----------
CREATE TABLE IF NOT EXISTS order_items (
    id           SERIAL PRIMARY KEY,
    order_id     INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id   INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,             -- snapshot
    quantity     INTEGER NOT NULL,
    price        NUMERIC(12,2) NOT NULL     -- snapshot
);

-- ---------- ai_messages (AI conversation memory) ----------
CREATE TABLE IF NOT EXISTS ai_messages (
    id         SERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role       TEXT NOT NULL CHECK (role IN ('user','assistant','system','tool')),
    content    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- pending_questions (escalation queue to admin) ----------
CREATE TABLE IF NOT EXISTS pending_questions (
    id         SERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question   TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','answered')),
    answer     TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- reviews ----------
CREATE TABLE IF NOT EXISTS reviews (
    id         SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id    BIGINT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- indexes ----------
CREATE INDEX IF NOT EXISTS idx_products_category      ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user        ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user            ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_user       ON ai_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_variants_product       ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_attributes_product     ON product_attributes(product_id);
CREATE INDEX IF NOT EXISTS idx_images_product         ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product        ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_pending_questions_stat ON pending_questions(status);

COMMIT;
