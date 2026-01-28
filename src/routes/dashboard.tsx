import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Building2,
	MapPin,
	Users,
	ScanLine,
	TrendingUp,
	ArrowRight
} from "lucide-react";
import { UsersRole } from "@/sdk/database/orm/orm_users";

export const Route = createFileRoute("/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const { user } = useAuth();

	// Show upgrade message for free users
	if (user && user.role === UsersRole.FREE) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
				<Card className="max-w-md w-full">
					<CardHeader>
						<CardTitle className="text-2xl">Upgrade Required</CardTitle>
						<CardDescription>
							Access to the Admin Dashboard requires a Paid Admin account.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600 mb-6">
							Upgrade to unlock full access to school management, student tracking,
							and attendance analytics.
						</p>
						<Link to="/upgrade">
							<Button className="w-full" size="lg">
								Upgrade to Paid Admin
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Admin Dashboard
					</h1>
					<p className="text-lg text-gray-600">
						Welcome back, {user?.full_name}
					</p>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Total Schools</p>
									<p className="text-3xl font-bold text-gray-900 mt-1">-</p>
								</div>
								<Building2 className="size-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Locations</p>
									<p className="text-3xl font-bold text-gray-900 mt-1">-</p>
								</div>
								<MapPin className="size-8 text-green-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Students</p>
									<p className="text-3xl font-bold text-gray-900 mt-1">-</p>
								</div>
								<Users className="size-8 text-purple-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Scan Events</p>
									<p className="text-3xl font-bold text-gray-900 mt-1">-</p>
								</div>
								<ScanLine className="size-8 text-orange-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Management Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Schools Management */}
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="flex items-center gap-3">
								<Building2 className="size-6 text-blue-600" />
								<CardTitle>Schools</CardTitle>
							</div>
							<CardDescription>
								Manage your schools and their configurations
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 mb-4">
								View and manage all schools in your organization. Add new schools,
								update details, and configure settings.
							</p>
							<Link to="/schools">
								<Button variant="outline" className="w-full group">
									Manage Schools
									<ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</Button>
							</Link>
						</CardContent>
					</Card>

					{/* Locations Management */}
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="flex items-center gap-3">
								<MapPin className="size-6 text-green-600" />
								<CardTitle>Locations</CardTitle>
							</div>
							<CardDescription>
								Manage physical locations and check-in points
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 mb-4">
								Configure classrooms, hallways, entrances, and other locations
								where students can be scanned.
							</p>
							<Link to="/locations">
								<Button variant="outline" className="w-full group">
									Manage Locations
									<ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</Button>
							</Link>
						</CardContent>
					</Card>

					{/* Students Management */}
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="flex items-center gap-3">
								<Users className="size-6 text-purple-600" />
								<CardTitle>Students</CardTitle>
							</div>
							<CardDescription>
								View and manage student records
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 mb-4">
								Access student profiles, update information, and track
								attendance patterns across your organization.
							</p>
							<Link to="/students">
								<Button variant="outline" className="w-full group">
									Manage Students
									<ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</Button>
							</Link>
						</CardContent>
					</Card>

					{/* Scan Events Management */}
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="flex items-center gap-3">
								<ScanLine className="size-6 text-orange-600" />
								<CardTitle>Scan Events</CardTitle>
							</div>
							<CardDescription>
								Track and analyze attendance data
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 mb-4">
								View all scan events, filter by date, location, or student,
								and export data for reporting.
							</p>
							<Link to="/scan-events">
								<Button variant="outline" className="w-full group">
									View Scan Events
									<ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>

				{/* Activity Summary */}
				<Card className="mt-6 bg-blue-50 border-none">
					<CardContent className="pt-6">
						<div className="flex items-start gap-4">
							<TrendingUp className="size-8 text-blue-600 flex-shrink-0" />
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">
									Getting Started
								</h3>
								<p className="text-gray-700 mb-3">
									Start by setting up your schools and locations, then add students
									to begin tracking attendance. Scan events will automatically appear
									as students check in at different locations.
								</p>
								<div className="flex flex-wrap gap-2">
									<Link to="/schools">
										<Button size="sm">Add Schools</Button>
									</Link>
									<Link to="/locations">
										<Button size="sm" variant="outline">Add Locations</Button>
									</Link>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
