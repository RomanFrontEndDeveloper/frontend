import type { HTMLAttributes } from 'react';

type DividerProps = HTMLAttributes<HTMLHRElement>;

export const Divider = ({ className = '', ...props }: DividerProps) => {
	return <hr className={`border-gray-200 ${className}`} {...props} />;
};
