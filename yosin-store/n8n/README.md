# n8n — Yosin Store backend (bot + AI + Mini App API)

n8n hosts three things:

1. **Telegram bot** — Telegram Trigger → block check → AI Agent → reply.
2. **AI Agent (Claude)** — Anthropic Chat Model with tool-calling; memory in `ai_messages`.
3. **Mini App HTTP API** — Webhook nodes implementing the API contract (see repo root `README.md` §3).

> Full workflow JSON is exported into this folder as you build each workflow in the
> n8n editor (`Export → Download`). This README is the build + import guide.

## Import & setup

1. Bring the stack up: `docker compose up -d` (see root `README.md`).
2. Open the editor at `https://<domain>/n8n/`.
3. **Credentials** → add:
   - *Postgres*: host `postgres`, db/user/pass from `.env`, schema `public`.
   - *Anthropic*: API key from `.env` (`ANTHROPIC_API_KEY`).
   - *Telegram*: `BOT_TOKEN` from `.env`.
4. **Import** each `*.json` in this folder (`Import from File`).
5. Set the Telegram webhook (see root `README.md` §10).
6. Activate the workflows.

## Workflows to build

| # | Workflow | Trigger | Purpose |
|---|----------|---------|---------|
| 1 | `bot-main` | Telegram Trigger | `/start` welcome + Mini App button; route text to AI Agent; skip if `is_blocked`. |
| 2 | `ai-agent` | (called by bot-main) | Claude AI Agent + tools; loads/saves `ai_messages`. |
| 3 | `api-*` | Webhook | One per API endpoint; each does initData validation → SQL → Respond to Webhook. |
| 4 | `admin-notify` | called on new order | Telegram message to `admin_chat_id`. |
| 5 | `escalation` | new `pending_questions` row / admin reply | Notify admin; deliver admin answer back to user. |
| 6 | `abuse-guard` | called by ai-agent | Raise `flags`; block + warn admin past threshold. |

## AI Agent tools (sub-workflows, each backed by Postgres)

- `search_products(query, category, min_price, max_price)`
- `get_product(id)`
- `list_categories()`
- `add_to_cart(user_id, variant_id, qty)`
- `view_cart(user_id)`
- `create_order(user_id, address, phone)` — **recomputes total from DB variant prices**
- `get_order_status(user_id)`
- `escalate_to_admin(user_id, question)` → inserts into `pending_questions`

The AI **never** invents prices/discounts — it only reflects DB values, and totals are
always computed server-side inside `create_order`.

## initData validation (every Mini App API webhook)

Each `/api/*` webhook MUST validate Telegram `initData` before touching the DB. Use a
Code node running `validate-initdata.js` (in this folder). It returns the authenticated
`user_id`; the client-sent id is ignored. Invalid signature → respond `401`.

## System prompt

The Claude AI Agent's system prompt lives in `system-prompt.md` (this folder). Paste it
into the AI Agent node. It encodes the sales persona **and** the hard security rules
(anti social-engineering, no secret data, DB-only pricing, escalate-don't-guess).
