import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoriteApi } from '../api/favoriteApi';
import toast from 'react-hot-toast';
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
			toast.success('Added to favorites!');
		},
		onError: () => {
			toast.error('Something went wrong.');
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
			toast.success('Removed from favorites!');
		},
		onError: () => {
			toast.error('Something went wrong.');
		},
	});
};
