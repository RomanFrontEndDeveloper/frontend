import Link from 'next/link';

import { Button } from '@/shared/ui';

export default function NotFound() {
	return (
		<div className='flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-6 bg-background px-6'>
			<h1 className='text-5xl font-bold text-foreground'>404</h1>

			<h2 className='text-3xl font-semibold text-foreground'>
				Page not found
			</h2>

			<p className='max-w-lg text-center text-gray-500 dark:text-gray-400'>
				The page you are looking for does not exist or has been moved.
			</p>

			<Link href='/dashboard'>
				<Button>Go to Dashboard</Button>
			</Link>
		</div>
	);
}
