'use client';

import { ReactNode } from 'react';
import { useEffect } from 'react';
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

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'
			onClick={onClose}
		>
			<div
				className='w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl'
				onClick={(e) => e.stopPropagation()}
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
			</div>
		</div>
	);
};
