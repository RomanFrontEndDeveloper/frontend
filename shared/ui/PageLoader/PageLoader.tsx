import { Spinner } from '@/shared/ui';

type PageLoaderProps = {
	text?: string;
};

export function PageLoader({ text = 'Loading...' }: PageLoaderProps) {
	return (
		<div className='flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-6 bg-background'>
			<Spinner />

			<p className='text-3xl font-semibold text-foreground'>{text}</p>
		</div>
	);
}
