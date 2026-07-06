/**
 * Telegram Mini App initData validation — for an n8n Code node.
 *
 * Verifies the HMAC-SHA256 signature Telegram attaches to `initData`, using the
 * bot token as the secret. Returns the AUTHENTICATED user id (from Telegram's
 * signed payload) so the workflow never trusts a client-sent id.
 *
 * Node input: expects `initData` (raw query string) on the incoming item, e.g.
 *   const initData = $json.body?.initData || $json.headers['x-init-data'];
 * On success returns { user_id, user }. On failure throws -> respond 401.
 *
 * Docs: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
const crypto = require('crypto');

function validateInitData(initData, botToken) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) throw new Error('missing hash');
  params.delete('hash');

  // Build the data-check-string: sorted "key=value" lines joined by "\n".
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  // secret_key = HMAC_SHA256(bot_token, "WebAppData")
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computed = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  // constant-time compare
  const ok =
    computed.length === hash.length &&
    crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hash, 'hex'));
  if (!ok) throw new Error('invalid initData signature');

  // Optional freshness check (reject stale auth, e.g. older than 24h)
  const authDate = Number(params.get('auth_date') || 0);
  if (authDate && Date.now() / 1000 - authDate > 86400) {
    throw new Error('initData expired');
  }

  const user = JSON.parse(params.get('user') || '{}');
  if (!user.id) throw new Error('no user in initData');
  return { user_id: user.id, user };
}

// --- n8n Code node entrypoint ---
const initData = $json.body?.initData || $json.query?.initData || $json.headers?.['x-init-data'];
const botToken = $env.BOT_TOKEN;
const { user_id, user } = validateInitData(initData, botToken);
return [{ json: { user_id, user } }];
