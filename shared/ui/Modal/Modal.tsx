'use client';

import { ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/shared/ui';

interface ModalProps {
	isOpen: boolean;
	title: string;
	children: ReactNode;
	onClose: () => void;
	onConfirm: () => void;
}

export const Modal = ({
	isOpen,
	title,
	children,
	onClose,
	onConfirm,
}: ModalProps) => {
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEscape);
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = '';
		};
	}, [isOpen, onClose]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'
					onClick={onClose}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					<motion.div
						className='w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl'
						onClick={(e) => e.stopPropagation()}
						initial={{
							opacity: 0,
							scale: 0.95,
							y: 20,
						}}
						animate={{
							opacity: 1,
							scale: 1,
							y: 0,
						}}
						exit={{
							opacity: 0,
							scale: 0.95,
							y: 20,
						}}
						transition={{
							duration: 0.25,
							ease: 'easeOut',
						}}
					>
						<h2 className='mb-4 text-2xl font-bold'>{title}</h2>

						<div className='mb-6'>{children}</div>

						<div className='flex justify-end gap-3'>
							<Button variant='secondary' onClick={onClose}>
								Cancel
							</Button>

							<Button
								className='bg-red-600 hover:bg-red-700'
								onClick={onConfirm}
							>
								Confirm
							</Button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
