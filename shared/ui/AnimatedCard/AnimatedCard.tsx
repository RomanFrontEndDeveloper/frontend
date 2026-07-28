'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
	children: ReactNode;
	delay?: number;
	className?: string;
}

export const AnimatedCard = ({
	children,
	delay = 0,
	className = '',
}: AnimatedCardProps) => {
	return (
		<motion.div
			initial={{
				opacity: 0,
				y: 20,
			}}
			animate={{
				opacity: 1,
				y: 0,
			}}
			transition={{
				duration: 0.35,
				delay,
				ease: 'easeOut',
			}}
			whileHover={{
				y: -4,
				scale: 1.015,
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
};
