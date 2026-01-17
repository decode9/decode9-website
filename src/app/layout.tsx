import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jorge Bastidas | decode9 - Full Stack Developer',
  description: 'Full Stack Developer with over 10 years of experience. Specialized in scalable architectures, automation, and MVP development. TypeScript, React, Node.js, DevOps.',
  keywords: [
    'Jorge Bastidas',
    'decode9',
    'Full Stack Developer',
    'Software Engineer',
    'React Developer',
    'Node.js Developer',
    'TypeScript',
    'Argentina',
    'Freelance Developer',
  ],
  authors: [{ name: 'Jorge Bastidas', url: 'https://github.com/decode9' }],
  creator: 'Jorge Bastidas',
  icons: {
    icon: [
      { url: 'https://avatars.githubusercontent.com/u/25024663?v=4', type: 'image/png' },
    ],
    shortcut: 'https://avatars.githubusercontent.com/u/25024663?v=4',
    apple: 'https://avatars.githubusercontent.com/u/25024663?v=4',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://decode9.dev',
    siteName: 'decode9',
    title: 'Jorge Bastidas | decode9 - Full Stack Developer',
    description: 'Full Stack Developer with over 10 years of experience. Specialized in scalable architectures, automation, and MVP development.',
    images: [
      {
        url: 'https://avatars.githubusercontent.com/u/25024663?v=4',
        width: 460,
        height: 460,
        alt: 'decode9 - Jorge Bastidas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jorge Bastidas | decode9 - Full Stack Developer',
    description: 'Full Stack Developer with over 10 years of experience.',
    creator: '@decode9',
    images: ['https://avatars.githubusercontent.com/u/25024663?v=4'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" translate="no">
      <head>
        <link rel="icon" href="https://avatars.githubusercontent.com/u/25024663?v=4" />
        <link rel="apple-touch-icon" href="https://avatars.githubusercontent.com/u/25024663?v=4" />
        <meta name="google" content="notranslate" />
      </head>
      <body className="bg-dark-950 text-dark-100 antialiased">
        {children}
      </body>
    </html>
  );
}
