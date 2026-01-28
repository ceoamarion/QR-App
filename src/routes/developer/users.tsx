import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft } from "lucide-react";
import { UsersRole } from "@/sdk/database/orm/orm_users";

export const Route = createFileRoute("/developer/users")({
	component: DeveloperUsersPage,
});

function DeveloperUsersPage() {
	const { user } = useAuth();

	// Only allow DEVELOPER role
	if (user && user.role !== UsersRole.DEVELOPER) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
				<Card className="max-w-md w-full">
					<CardHeader>
						<CardTitle className="text-2xl">Access Denied</CardTitle>
						<CardDescription>
							This page is only accessible to developers with super-admin privileges.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Link to="/dashboard">
							<Button className="w-full" size="lg">
								Go to Dashboard
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 py-12 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<Link to="/developer">
						<Button variant="ghost" size="sm" className="mb-4 group text-gray-300 hover:text-white">
							<ArrowLeft className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" />
							Back to Developer Console
						</Button>
					</Link>
					<div className="flex items-center gap-3 mb-2">
						<Users className="size-8 text-blue-400" />
						<h1 className="text-4xl font-bold text-white">User Management</h1>
					</div>
					<p className="text-lg text-gray-400">
						View and manage all user accounts across the system
					</p>
				</div>

				{/* Empty State */}
				<Card className="bg-gray-800 border-gray-700">
					<CardContent className="py-16 text-center">
						<Users className="size-16 text-gray-600 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-white mb-2">
							User Management Interface
						</h3>
						<p className="text-gray-400 mb-6 max-w-md mx-auto">
							This interface will display all user accounts with the ability to
							change roles, enable/disable accounts, and view user profiles.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
