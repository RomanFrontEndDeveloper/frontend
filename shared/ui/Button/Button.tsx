import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary';
};

export const Button = ({
	children,
	className = '',
	variant = 'primary',
	...props
}: ButtonProps) => {
	const variantClass =
		variant === 'primary'
			? 'bg-blue-600 text-white hover:bg-blue-700'
			: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700';

	return (
		<button
			className={`rounded-lg px-4 py-2 transition-colors duration-200 ${variantClass} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};
