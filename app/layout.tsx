import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/widgets/Header';
import { Footer } from '@/widgets/Footer';
import { Providers } from '@/shared/providers';
import { ThemeProvider } from '@/shared/providers/theme/ThemeContext';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: {
		default: 'FreelanceHub',
		template: '%s | FreelanceHub',
	},
	description:
		'FreelanceHub is a modern freelance marketplace built with Next.js, React, TypeScript and Node.js.',

	keywords: [
		'freelance',
		'marketplace',
		'next.js',
		'react',
		'typescript',
		'node.js',
		'portfolio',
	],

	authors: [
		{
			name: 'Roman Okhremov',
		},
	],

	creator: 'Roman Okhremov',

	applicationName: 'FreelanceHub',

	metadataBase: new URL('https://freelancehub.com'),

	alternates: {
		canonical: '/',
	},

	icons: {
		icon: '/favicon.ico',
	},

	openGraph: {
		title: 'FreelanceHub',
		description:
			'Modern freelance marketplace built with Next.js, React, TypeScript and Node.js.',
		url: 'https://freelancehub.com',
		siteName: 'FreelanceHub',
		type: 'website',
		locale: 'en_US',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'FreelanceHub',
			},
		],
	},

	twitter: {
		card: 'summary_large_image',
		title: 'FreelanceHub',
		description:
			'Modern freelance marketplace built with Next.js, React, TypeScript and Node.js.',
		images: ['/og-image.png'],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='uk'
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className='min-h-screen flex flex-col'>
				<ThemeProvider>
					<Providers>
						<Header />
						<main className='flex-1'>{children}</main>
						<Footer />
						<Toaster
							position='top-right'
							toastOptions={{
								duration: 3000,
							}}
						/>
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}
