import type { HTMLAttributes, ReactNode } from 'react';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
	children: ReactNode;
};

export const Badge = ({ children, className = '', ...props }: BadgeProps) => {
	return (
		<span
			className={`inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 ${className}`}
			{...props}
		>
			{children}
		</span>
	);
};
