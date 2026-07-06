// Thin wrapper over the Telegram Web App SDK.
// Degrades gracefully to a no-op in a normal browser so the demo runs anywhere.

interface TgWebApp {
  ready: () => void;
  expand: () => void;
  initData: string;
  colorScheme: 'light' | 'dark';
  themeParams?: Record<string, string>;
  initDataUnsafe?: { user?: { id: number; first_name?: string; username?: string } };
  HapticFeedback?: { impactOccurred: (s: string) => void; notificationOccurred: (s: string) => void };
  setHeaderColor?: (c: string) => void;
  setBackgroundColor?: (c: string) => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp };
  }
}

export const tg = (): TgWebApp | undefined => window.Telegram?.WebApp;

export function initTelegram() {
  const app = tg();
  if (!app) return;
  app.ready();
  app.expand();
  // Match app chrome to our warm palette.
  const dark = app.colorScheme === 'dark';
  app.setHeaderColor?.(dark ? '#12110F' : '#FBF8F2');
  app.setBackgroundColor?.(dark ? '#12110F' : '#FBF8F2');
  if (dark) document.documentElement.classList.add('dark');
}

/** Raw initData for API auth. Empty in a browser (demo mode falls back to mock). */
export const initData = (): string => tg()?.initData ?? '';

export function haptic(kind: 'light' | 'medium' | 'success' | 'warning' = 'light') {
  const hf = tg()?.HapticFeedback;
  if (!hf) return;
  if (kind === 'success' || kind === 'warning') hf.notificationOccurred(kind);
  else hf.impactOccurred(kind);
}

export const tgUser = () => tg()?.initDataUnsafe?.user;
