import { Skeleton } from '@/shared/ui';

export function SkeletonCard() {
	return (
		<div className='space-y-4 rounded-lg border border-border p-6'>
			<Skeleton className='h-7 w-2/3' />

			<Skeleton className='h-4 w-full' />
			<Skeleton className='h-4 w-5/6' />

			<div className='flex justify-between pt-4'>
				<Skeleton className='h-10 w-24' />
				<Skeleton className='h-10 w-24' />
			</div>
		</div>
	);
}
