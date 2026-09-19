import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { DataProvider } from '@/context/DataContext';
import { AnimatedBackground } from '@/components/background/AnimatedBackground';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AryanDailyTrack | Personal Routine, Wellness & Productivity Platform',
  description:
    'Plan, track, understand, and improve your daily routine, productivity, studies, workouts, meals, and sleep with AryanDailyTrack.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="medium"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="dark light" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const s = localStorage.getItem('daytrack_appearance_settings');
                if (s) {
                  const parsed = JSON.parse(s);
                  if (parsed.theme) {
                    document.documentElement.setAttribute('data-theme', parsed.theme);
                    document.documentElement.setAttribute('data-animation', parsed.backgroundAnimation ? 'on' : 'off');
                    document.documentElement.setAttribute('data-intensity', parsed.intensity || 'medium');
                    document.documentElement.setAttribute('data-reduced-motion', parsed.reduceMotion ? 'true' : 'false');
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col selection:bg-[var(--accent-primary)]/20 selection:text-[var(--accent-primary)]">
        <ThemeProvider>
          <DataProvider>
            {/* Master GPU-Accelerated Background System */}
            <AnimatedBackground />

            {/* App Content with relative z-index so it floats crisply over the background */}
            <div className="relative z-10 flex flex-col flex-1 min-h-screen">
              {children}
            </div>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
