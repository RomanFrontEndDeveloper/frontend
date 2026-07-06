import { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	error?: boolean;
};

export const Input = ({ className = '', error, ...props }: InputProps) => {
	return (
		<input
			className={`
        w-full
        rounded-lg
        border
        px-4
        py-2
        outline-none
        transition

        ${
			error
				? 'border-red-500 focus:border-red-500'
				: 'border-gray-300 focus:border-blue-600'
		}

        ${className}
        `}
			{...props}
		/>
	);
};
