import type { Metadata } from 'next';
import FavoritesPage from './FavoritesPage';

export const metadata: Metadata = {
	title: 'Favorites',
	description: 'View your favorite projects on Roman-FreelanceHub.',
};

export default function Page() {
	return <FavoritesPage />;
}
