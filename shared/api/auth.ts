import { axiosInstance } from './axios';
import type { LoginFormData } from '@/shared/validation/auth';

type User = {
	id: string;
	email: string;
};

type LoginResponse = {
	success: boolean;
	token: string;
	user: User;
	message: string;
};

type ProfileUser = {
	_id: string;
	email: string;
	createdAt: string;
	updatedAt: string;
};

type ProfileResponse = {
	success: boolean;
	user: ProfileUser;
};

export const authApi = {
	login: async (data: LoginFormData): Promise<LoginResponse> => {
		const response = await axiosInstance.post<LoginResponse>(
			'/auth/login',
			data,
		);

		return response.data;
	},

	getProfile: async (): Promise<ProfileResponse> => {
		const response =
			await axiosInstance.get<ProfileResponse>('/auth/profile');

		return response.data;
	},
};
