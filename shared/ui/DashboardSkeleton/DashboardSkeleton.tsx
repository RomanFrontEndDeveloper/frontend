import { Container, Card, Skeleton, SkeletonCard } from '@/shared/ui';

export function DashboardSkeleton() {
	return (
		<Container>
			<div className='mx-auto mt-8 max-w-6xl'>
				<Skeleton className='mb-4 h-8 w-56' />

				<div className='mb-10 flex flex-wrap gap-4'>
					<Skeleton className='h-11 w-40' />
					<Skeleton className='h-11 w-40' />
					<Skeleton className='h-11 w-28' />
				</div>

				<div className='mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
					{Array.from({ length: 4 }).map((_, index) => (
						<Card key={index}>
							<Skeleton className='mb-4 h-6 w-28' />

							<Skeleton className='h-8 w-24' />
						</Card>
					))}
				</div>

				<div className='mt-10'>
					<Skeleton className='mx-auto mb-6 h-10 w-72' />

					<div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
						{Array.from({ length: 3 }).map((_, index) => (
							<SkeletonCard key={index} />
						))}
					</div>
				</div>
			</div>
		</Container>
	);
}
