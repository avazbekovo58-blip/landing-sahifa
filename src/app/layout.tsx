import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deutsch Sprechtest — KI Prüfungssimulator',
  description: 'Übe dein gesprochenes Deutsch mit einem KI-Prüfer und erhalte sofortiges Feedback.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="dark">
      <body>{children}</body>
    </html>
  );
}
