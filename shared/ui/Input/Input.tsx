import { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className = '', ...props }: InputProps) => {
	return (
		<input
			className={`w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-600 ${className}`}
			{...props}
		/>
	);
};
