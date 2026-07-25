import { axiosInstance } from './axios';

export const favoriteApi = {
	getFavorites: async () => {
		const { data } = await axiosInstance.get('/favorites');

		return data;
	},

	addFavorite: async (projectId: string) => {
		const { data } = await axiosInstance.post(`/favorites/${projectId}`);

		return data;
	},

	removeFavorite: async (projectId: string) => {
		const { data } = await axiosInstance.delete(`/favorites/${projectId}`);

		return data;
	},
};
