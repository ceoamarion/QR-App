import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { UsersRole } from "@/sdk/database/orm/orm_users";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
	children: ReactNode;
	requiredRoles?: UsersRole[];
	redirectTo?: string;
}

export function ProtectedRoute({ children, requiredRoles, redirectTo = "/login" }: ProtectedRouteProps) {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to={redirectTo} />;
	}

	if (requiredRoles && !requiredRoles.includes(user.role)) {
		// User doesn't have required role, redirect to home
		return <Navigate to="/" />;
	}

	return <>{children}</>;
}

export function FreeUserGuard({ children }: { children: ReactNode }) {
	return <ProtectedRoute requiredRoles={[UsersRole.FREE]}>{children}</ProtectedRoute>;
}

export function PaidAdminGuard({ children }: { children: ReactNode }) {
	return <ProtectedRoute requiredRoles={[UsersRole.PAID_ADMIN, UsersRole.DEVELOPER]}>{children}</ProtectedRoute>;
}

export function DeveloperGuard({ children }: { children: ReactNode }) {
	return <ProtectedRoute requiredRoles={[UsersRole.DEVELOPER]}>{children}</ProtectedRoute>;
}
