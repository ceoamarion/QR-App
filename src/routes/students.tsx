import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft, Plus } from "lucide-react";
import { UsersRole } from "@/sdk/database/orm/orm_users";

export const Route = createFileRoute("/students")({
	component: StudentsPage,
});

function StudentsPage() {
	const { user } = useAuth();

	// Redirect free users
	if (user && user.role === UsersRole.FREE) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
				<Card className="max-w-md w-full">
					<CardHeader>
						<CardTitle className="text-2xl">Upgrade Required</CardTitle>
						<CardDescription>
							Access to Students management requires a Paid Admin account.
						</CardDescription>
					</CardHeader>
					<CardContent>
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
					<Link to="/dashboard">
						<Button variant="ghost" size="sm" className="mb-4 group">
							<ArrowLeft className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" />
							Back to Dashboard
						</Button>
					</Link>
					<div className="flex items-center justify-between">
						<div>
							<div className="flex items-center gap-3 mb-2">
								<Users className="size-8 text-purple-600" />
								<h1 className="text-4xl font-bold text-gray-900">Students</h1>
							</div>
							<p className="text-lg text-gray-600">
								Manage student records and profiles
							</p>
						</div>
						<Button size="lg">
							<Plus className="size-5 mr-2" />
							Add Student
						</Button>
					</div>
				</div>

				{/* Empty State */}
				<Card>
					<CardContent className="py-16 text-center">
						<Users className="size-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							No students yet
						</h3>
						<p className="text-gray-600 mb-6 max-w-md mx-auto">
							Add students to start tracking their attendance. You can import
							students in bulk or add them individually.
						</p>
						<Button>
							<Plus className="size-5 mr-2" />
							Add Your First Student
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
