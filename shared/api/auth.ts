import { axiosInstance } from './axios';
import type { LoginFormData, RegisterFormData } from '@/shared/validation/auth';

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

export type RegisterResponse = {
	success: boolean;
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

	register(data: RegisterFormData): Promise<RegisterResponse> {
		return axiosInstance
			.post('/auth/register', data)
			.then((res) => res.data);
	},

	getProfile: async (): Promise<ProfileResponse> => {
		const response =
			await axiosInstance.get<ProfileResponse>('/auth/profile');

		return response.data;
	},
};
