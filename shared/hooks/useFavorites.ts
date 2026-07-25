import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoriteApi } from '../api/favoriteApi';

export const useFavorites = () => {
	return useQuery({
		queryKey: ['favorites'],
		queryFn: favoriteApi.getFavorites,
	});
};

export const useAddFavorite = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: favoriteApi.addFavorite,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['favorites'],
			});
		},
	});
};

export const useRemoveFavorite = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: favoriteApi.removeFavorite,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['favorites'],
			});
		},
	});
};
