import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, className = '', ...props }: ButtonProps) => {
	return (
		<button
			className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-800 transition ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};
