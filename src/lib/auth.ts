import { UsersORM, UsersRole, type UsersModel } from "@/sdk/database/orm/orm_users";

// Simple client-side password hashing (in production, use bcrypt on server)
export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface AuthUser {
	id: string;
	full_name: string;
	email: string;
	role: UsersRole;
	organization_id: string | null;
	is_active: boolean;
}

// Local storage keys
const AUTH_USER_KEY = "hallguardian_auth_user";
const AUTH_TOKEN_KEY = "hallguardian_auth_token";

export function saveAuthUser(user: AuthUser): void {
	localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
	localStorage.setItem(AUTH_TOKEN_KEY, user.id); // Simple token = user ID
}

export function getAuthUser(): AuthUser | null {
	const userJson = localStorage.getItem(AUTH_USER_KEY);
	if (!userJson) return null;
	try {
		return JSON.parse(userJson) as AuthUser;
	} catch {
		return null;
	}
}

export function clearAuthUser(): void {
	localStorage.removeItem(AUTH_USER_KEY);
	localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
	return getAuthUser() !== null;
}

export function hasRole(role: UsersRole): boolean {
	const user = getAuthUser();
	return user?.role === role;
}

export function hasAnyRole(roles: UsersRole[]): boolean {
	const user = getAuthUser();
	return user ? roles.includes(user.role) : false;
}

export function isDeveloper(): boolean {
	return hasRole(UsersRole.DEVELOPER);
}

export function isPaidAdmin(): boolean {
	return hasRole(UsersRole.PAID_ADMIN);
}

export function isFree(): boolean {
	return hasRole(UsersRole.FREE);
}

export function getRoleName(role: UsersRole): string {
	switch (role) {
		case UsersRole.FREE:
			return "Free";
		case UsersRole.PAID_ADMIN:
			return "Paid Admin";
		case UsersRole.DEVELOPER:
			return "Developer";
		default:
			return "Unknown";
	}
}

// Convert UsersModel to AuthUser
export function userModelToAuthUser(user: UsersModel): AuthUser {
	return {
		id: user.id,
		full_name: user.full_name,
		email: user.email,
		role: user.role,
		organization_id: user.organization_id || null,
		is_active: user.is_active,
	};
}

// Sign up a new user
export async function signup(data: {
	full_name: string;
	email: string;
	password: string;
	organization_name: string;
	phone?: string;
}): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
	try {
		const usersOrm = UsersORM.getInstance();

		// Check if email already exists using email index
		const existingUsers = await usersOrm.getUsersByEmail(data.email);

		if (existingUsers && existingUsers.length > 0) {
			return { success: false, error: "Email already registered" };
		}

		// Determine role based on email
		const role = data.email === "team@hallguardian.com"
			? UsersRole.DEVELOPER
			: UsersRole.FREE;

		// Hash password
		const password_hash = await hashPassword(data.password);

		// Create user
		const newUser: Partial<UsersModel> = {
			full_name: data.full_name,
			email: data.email,
			password_hash,
			phone: data.phone || null,
			role,
			is_active: true,
			last_login: null,
			organization_id: null, // Will be set after creating organization
		};

		const createdUsers = await usersOrm.insertUsers([newUser as UsersModel]);

		if (!createdUsers || createdUsers.length === 0) {
			return { success: false, error: "Failed to create user" };
		}

		const user = createdUsers[0];

		// Create organization (importing here to avoid circular dependency)
		const { OrganizationsORM } = await import("@/sdk/database/orm/orm_organizations");
		const orgsOrm = OrganizationsORM.getInstance();

		const newOrg = await orgsOrm.insertOrganizations([{
			name: data.organization_name,
			type: "school",
			created_by_user_id: user.id,
		} as any]);

		if (newOrg && newOrg.length > 0) {
			// Update user with organization_id using email index
			const updatedUser = { ...user, organization_id: newOrg[0].id };
			await usersOrm.setUsersByEmail(user.email, updatedUser);

			const authUser = userModelToAuthUser(updatedUser);
			saveAuthUser(authUser);
			return { success: true, user: authUser };
		}

		const authUser = userModelToAuthUser(user);
		saveAuthUser(authUser);
		return { success: true, user: authUser };
	} catch (error) {
		console.error("Signup error:", error);
		return { success: false, error: "An error occurred during signup" };
	}
}

// Log in an existing user
export async function login(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
	try {
		const usersOrm = UsersORM.getInstance();
		const password_hash = await hashPassword(password);

		// Find user by email using email index
		const users = await usersOrm.getUsersByEmail(email);

		if (!users || users.length === 0) {
			return { success: false, error: "Invalid email or password" };
		}

		const user = users[0];

		// Check password
		if (user.password_hash !== password_hash) {
			return { success: false, error: "Invalid email or password" };
		}

		// Check if account is active
		if (!user.is_active) {
			return { success: false, error: "Account is disabled" };
		}

		// Update last login using email index
		const updatedUser = { ...user, last_login: Date.now().toString() };
		await usersOrm.setUsersByEmail(email, updatedUser);

		const authUser = userModelToAuthUser(updatedUser);
		saveAuthUser(authUser);
		return { success: true, user: authUser };
	} catch (error) {
		console.error("Login error:", error);
		return { success: false, error: "An error occurred during login" };
	}
}

// Log out
export function logout(): void {
	clearAuthUser();
}

// Upgrade user from FREE to PAID_ADMIN
export async function upgradeUserToPaid(userId: string): Promise<boolean> {
	try {
		const usersOrm = UsersORM.getInstance();
		const users = await usersOrm.getUsersByIDs([userId]);

		if (!users || users.length === 0) {
			return false;
		}

		const user = users[0];
		const updatedUser = { ...user, role: UsersRole.PAID_ADMIN };

		// Update using ID index
		await usersOrm.setUsersById(userId, updatedUser);

		// Update local storage if this is the current user
		const currentUser = getAuthUser();
		if (currentUser && currentUser.id === userId) {
			saveAuthUser({ ...currentUser, role: UsersRole.PAID_ADMIN });
		}

		return true;
	} catch (error) {
		console.error("Upgrade error:", error);
		return false;
	}
}
