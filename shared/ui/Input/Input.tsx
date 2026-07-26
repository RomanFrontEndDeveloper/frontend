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
				transition-colors
				duration-200
				bg-white
				text-gray-900
				placeholder:text-gray-400
				dark:bg-gray-900
				dark:text-white
				dark:placeholder:text-gray-500

				${
					error
						? 'border-red-500 focus:border-red-500'
						: 'border-gray-300 dark:border-gray-700 focus:border-blue-600'
				}

				${className}
			`}
			{...props}
		/>
	);
};
