import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode;
};

export const Card = ({ children, className = '', ...props }: CardProps) => {
	return (
		<div
			className={`rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white p-6 ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};
