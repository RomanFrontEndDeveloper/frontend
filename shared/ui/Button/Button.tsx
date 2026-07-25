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
			? 'bg-blue-600 text-white hover:bg-blue-800'
			: 'bg-gray-200 text-gray-900 hover:bg-gray-300';

	return (
		<button
			className={`px-4 py-2 rounded-lg transition ${variantClass} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};
