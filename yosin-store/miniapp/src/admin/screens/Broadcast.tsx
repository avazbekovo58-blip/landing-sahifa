import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { IcMega, IcCheck } from '../../components/Icons';

export function AdminBroadcast() {
  const { stats } = useAdmin();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState<number | null>(null);

  function send() {
    if (!message.trim()) return;
    // LIVE: POST /admin/broadcast -> n8n fans out Telegram messages to all users.
    setSent(stats.customers);
    setMessage('');
    setTimeout(() => setSent(null), 3500);
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-2 text-primary">
          <IcMega width={22} height={22} />
          <h3 className="font-display text-base font-bold text-ink dark:text-d-ink">Barcha mijozlarga xabar</h3>
        </div>
        <p className="mt-1 text-sm text-muted dark:text-d-muted">
          Xabar {stats.customers} ta foydalanuvchiga Telegram bot orqali yuboriladi.
        </p>
        <textarea
          className="input mt-4 resize-none"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Masalan: Bugun barcha krossovkalarga 20% chegirma! 🎉"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted dark:text-d-muted">{message.length} belgi</span>
          <button onClick={send} disabled={!message.trim()} className={`btn-cta py-2.5 text-sm ${!message.trim() ? 'opacity-50' : ''}`}>
            <IcMega width={18} height={18} /> Yuborish
          </button>
        </div>
      </div>

      {sent !== null && (
        <div className="card flex items-center gap-3 border-primary/40 bg-primary-tint p-4 dark:bg-primary/10">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white"><IcCheck width={20} height={20} /></span>
          <span className="text-sm font-medium text-primary">Xabar {sent} ta mijozga yuborildi.</span>
        </div>
      )}
    </div>
  );
}
