import { axiosInstance } from './axios';
import type { LoginFormData } from '@/shared/validation/auth';

export const authApi = {
	login: async (data: LoginFormData) => {
		const response = await axiosInstance.post('/auth/login', data);

		return response.data;
	},
};
