import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/widgets/Header';
import { Footer } from '@/widgets/Footer';
import { Providers } from '@/shared/providers/index';
import { ThemeProvider } from '@/shared/providers/theme/ThemeContext';

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
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}
