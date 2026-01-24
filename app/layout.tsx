import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "BiteScout — World's Most Complete Trophy Fishing Database",
  description: 'AI-powered fishing assistant. Find the perfect charter, lodge, or guide from 1,500+ verified operators worldwide.',
  openGraph: {
    title: 'BiteScout — Trophy Fishing Database',
    description: 'AI finds your perfect fishing charter in seconds.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
