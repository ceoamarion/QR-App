import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type AuthUser, getAuthUser, logout as authLogout } from "@/lib/auth";
import { UsersRole } from "@/sdk/database/orm/orm_users";

interface AuthContextType {
	user: AuthUser | null;
	isLoading: boolean;
	login: (user: AuthUser) => void;
	logout: () => void;
	updateUser: (user: AuthUser) => void;
	hasRole: (role: UsersRole) => boolean;
	hasAnyRole: (roles: UsersRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Load user from localStorage on mount
		const savedUser = getAuthUser();
		setUser(savedUser);
		setIsLoading(false);
	}, []);

	const login = (authUser: AuthUser) => {
		setUser(authUser);
	};

	const logout = () => {
		authLogout();
		setUser(null);
	};

	const updateUser = (authUser: AuthUser) => {
		setUser(authUser);
	};

	const hasRole = (role: UsersRole) => {
		return user?.role === role;
	};

	const hasAnyRole = (roles: UsersRole[]) => {
		return user ? roles.includes(user.role) : false;
	};

	return (
		<AuthContext.Provider value={{ user, isLoading, login, logout, updateUser, hasRole, hasAnyRole }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
