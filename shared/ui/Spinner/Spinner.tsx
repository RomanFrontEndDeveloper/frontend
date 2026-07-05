import type { HTMLAttributes } from 'react';

type SpinnerProps = HTMLAttributes<HTMLDivElement>;

export const Spinner = ({ className = '', ...props }: SpinnerProps) => {
	return (
		<div
			className={`h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${className}`}
			{...props}
		/>
	);
};
