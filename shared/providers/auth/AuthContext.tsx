'use client';

import { createContext } from 'react';

export type User = {
	id: string;
	email: string;
};

type AuthContextType = {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	loading: boolean;
	logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
