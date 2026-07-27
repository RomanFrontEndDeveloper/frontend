'use client';

import { Button } from '@/shared/ui';

type ErrorStateProps = {
	error: Error;
	reset: () => void;
	title?: string;
	description?: string;
	showErrorMessage?: boolean;
};

export function ErrorState({
	error,
	reset,
	title = 'Something went wrong',
	description = 'An unexpected error occurred. Please try again.',
	showErrorMessage = false,
}: ErrorStateProps) {
	console.error(error);

	return (
		<div className='flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-6 bg-background px-6'>
			<h1 className='text-center text-4xl font-bold text-foreground'>
				{title}
			</h1>

			<p className='max-w-lg text-center text-gray-500 dark:text-gray-400'>
				{description}
			</p>

			{showErrorMessage && (
				<code className='max-w-2xl rounded-md bg-gray-100 p-4 text-center text-sm text-red-600 dark:bg-gray-900'>
					{error.message}
				</code>
			)}

			<Button onClick={reset}>Try Again</Button>
		</div>
	);
}
