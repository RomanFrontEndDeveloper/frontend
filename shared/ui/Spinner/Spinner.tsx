import type { HTMLAttributes } from 'react';

type SpinnerProps = HTMLAttributes<HTMLDivElement>;

export function Spinner({ className = '', ...props }: SpinnerProps) {
	return (
		<div
			className={`h-12 w-12 animate-spin rounded-full border-4 border-gray-500 border-t-blue-600 ${className}`}
			{...props}
		/>
	);
}
