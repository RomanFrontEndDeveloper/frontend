import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode;
};

export const Card = ({ children, className = '', ...props }: CardProps) => {
	return (
		<div
			className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
			{...props}
		>
			{children}
		</div>
	);
};
