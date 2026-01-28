import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Code2,
	Users,
	Building,
	Shield,
	Database,
	Activity
} from "lucide-react";
import { UsersRole } from "@/sdk/database/orm/orm_users";

export const Route = createFileRoute("/developer/")({
	component: DeveloperConsolePage,
});

function DeveloperConsolePage() {
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
					<div className="flex items-center gap-3 mb-2">
						<Code2 className="size-10 text-green-400" />
						<h1 className="text-4xl font-bold text-white">Developer Console</h1>
					</div>
					<p className="text-lg text-gray-400">
						Super-admin access to all system data and user management
					</p>
				</div>

				{/* System Stats */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<Card className="bg-gray-800 border-gray-700">
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-400">Total Users</p>
									<p className="text-3xl font-bold text-white mt-1">-</p>
								</div>
								<Users className="size-8 text-blue-400" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gray-800 border-gray-700">
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-400">Organizations</p>
									<p className="text-3xl font-bold text-white mt-1">-</p>
								</div>
								<Building className="size-8 text-purple-400" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gray-800 border-gray-700">
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-400">Paid Accounts</p>
									<p className="text-3xl font-bold text-white mt-1">-</p>
								</div>
								<Shield className="size-8 text-green-400" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gray-800 border-gray-700">
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-400">Total Students</p>
									<p className="text-3xl font-bold text-white mt-1">-</p>
								</div>
								<Database className="size-8 text-orange-400" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Management Sections */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{/* Users Management */}
					<Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
						<CardHeader>
							<div className="flex items-center gap-3">
								<Users className="size-6 text-blue-400" />
								<CardTitle className="text-white">User Management</CardTitle>
							</div>
							<CardDescription className="text-gray-400">
								View and manage all user accounts
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-gray-300 mb-4">
								Access all user accounts, change roles, enable/disable accounts,
								and view user activity across the entire system.
							</p>
							<Link to="/developer/users">
								<Button className="w-full bg-blue-600 hover:bg-blue-700">
									Manage Users
								</Button>
							</Link>
						</CardContent>
					</Card>

					{/* Organizations Management */}
					<Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
						<CardHeader>
							<div className="flex items-center gap-3">
								<Building className="size-6 text-purple-400" />
								<CardTitle className="text-white">Organizations</CardTitle>
							</div>
							<CardDescription className="text-gray-400">
								View and manage all organizations
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-gray-300 mb-4">
								Browse all organizations, view their schools, locations, and
								students. Monitor subscription status and usage.
							</p>
							<Link to="/developer/organizations">
								<Button className="w-full bg-purple-600 hover:bg-purple-700">
									Manage Organizations
								</Button>
							</Link>
						</CardContent>
					</Card>

					{/* System Data */}
					<Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors">
						<CardHeader>
							<div className="flex items-center gap-3">
								<Database className="size-6 text-green-400" />
								<CardTitle className="text-white">System Data</CardTitle>
							</div>
							<CardDescription className="text-gray-400">
								Access all system data and records
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-gray-300 mb-4">
								View all schools, locations, students, and scan events across
								every organization in the system.
							</p>
							<Link to="/developer/data">
								<Button className="w-full bg-green-600 hover:bg-green-700">
									View System Data
								</Button>
							</Link>
						</CardContent>
					</Card>

					{/* Activity Logs */}
					<Card className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors">
						<CardHeader>
							<div className="flex items-center gap-3">
								<Activity className="size-6 text-orange-400" />
								<CardTitle className="text-white">Activity Logs</CardTitle>
							</div>
							<CardDescription className="text-gray-400">
								Monitor system activity and events
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-gray-300 mb-4">
								View system-wide activity logs, user actions, scan events,
								and audit trails for security and monitoring.
							</p>
							<Link to="/developer/activity">
								<Button className="w-full bg-orange-600 hover:bg-orange-700">
									View Activity Logs
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>

				{/* Warning Card */}
				<Card className="bg-red-950 border-red-800">
					<CardContent className="pt-6">
						<div className="flex items-start gap-4">
							<Shield className="size-8 text-red-400 flex-shrink-0" />
							<div>
								<h3 className="font-semibold text-red-100 mb-2">
									Developer Console - Super Admin Access
								</h3>
								<p className="text-red-200 text-sm">
									You have unrestricted access to all data across all organizations.
									Exercise caution when making changes. All actions in this console
									are logged and auditable. This access is reserved for
									team@hallguardian.com accounts only.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
