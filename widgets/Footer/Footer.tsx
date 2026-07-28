export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='flex h-16 items-center justify-center border-t border-gray-200 dark:border-gray-700 transition-colors duration-200'>
			<p className='text-sm text-gray-500 dark:text-gray-400'>
				© {currentYear} Roman-FreelanceHub. All rights reserved.
			</p>
		</footer>
	);
};
