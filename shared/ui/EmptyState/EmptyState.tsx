import type { ReactNode } from 'react';

type EmptyStateProps = {
	title: string;
	description: string;
	children?: ReactNode;
};

export const EmptyState = ({
	title,
	description,
	children,
}: EmptyStateProps) => {
	return (
		<div className='flex flex-col items-center py-16 text-center'>
			<h2 className='text-2xl font-semibold'>{title}</h2>

			<p className='mt-2 text-gray-500'>{description}</p>

			{children && <div className='mt-6'>{children}</div>}
		</div>
	);
};
