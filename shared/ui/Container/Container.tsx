import type { ReactNode } from 'react';

type ContainerProps = {
	children: ReactNode;
};

export const Container = ({ children }: ContainerProps) => {
	return <div className='mx-auto w-full max-w-7xl px-4'>{children}</div>;
};
