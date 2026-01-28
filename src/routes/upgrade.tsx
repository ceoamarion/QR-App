import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { upgradeUserToPaid } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, CreditCard, TrendingUp } from "lucide-react";
import { UsersRole } from "@/sdk/database/orm/orm_users";

export const Route = createFileRoute("/upgrade")({
	component: UpgradePage,
});

function UpgradePage() {
	const { user, updateUser } = useAuth();
	const [isProcessing, setIsProcessing] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	// Redirect if already paid
	if (user && user.role !== UsersRole.FREE) {
		navigate({ to: "/dashboard" });
		return null;
	}

	async function handleUpgrade() {
		if (!user) return;

		setIsProcessing(true);
		setError(null);

		try {
			// Simulate payment processing
			await new Promise(resolve => setTimeout(resolve, 2000));

			// Upgrade user role
			const upgraded = await upgradeUserToPaid(user.id);

			if (upgraded) {
				const updatedUser = { ...user, role: UsersRole.PAID_ADMIN };
				updateUser(updatedUser);
				setSuccess(true);

				// Redirect to dashboard after 2 seconds
				setTimeout(() => {
					navigate({ to: "/dashboard" });
				}, 2000);
			} else {
				setError("Failed to upgrade account. Please try again.");
			}
		} catch (err) {
			setError("An error occurred during payment processing.");
			console.error(err);
		} finally {
			setIsProcessing(false);
		}
	}

	if (success) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
				<Card className="max-w-md w-full text-center">
					<CardContent className="pt-12 pb-12">
						<CheckCircle2 className="size-20 text-green-600 mx-auto mb-6" />
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Upgrade Successful!
						</h2>
						<p className="text-lg text-gray-600 mb-4">
							Your account has been upgraded to Paid Admin.
						</p>
						<p className="text-sm text-gray-500">
							Redirecting to dashboard...
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4">
			<div className="max-w-5xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Upgrade to Paid Admin
					</h1>
					<p className="text-lg text-gray-600">
						Unlock full access to HallGuardian's powerful admin tools
					</p>
				</div>

				{error && (
					<Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
					{/* Free Tier */}
					<Card className="opacity-60">
						<CardHeader>
							<CardTitle className="text-2xl">Free</CardTitle>
							<CardDescription>Your current plan</CardDescription>
							<div className="mt-4">
								<span className="text-4xl font-bold">$0</span>
								<span className="text-gray-600">/month</span>
							</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-3">
								<li className="flex items-start gap-2">
									<CheckCircle2 className="size-5 text-gray-400 flex-shrink-0 mt-0.5" />
									<span className="text-sm text-gray-600">Limited access to features</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 className="size-5 text-gray-400 flex-shrink-0 mt-0.5" />
									<span className="text-sm text-gray-600">Basic support</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					{/* Paid Admin */}
					<Card className="border-blue-600 border-2 relative shadow-lg">
						<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
							Recommended
						</div>
						<CardHeader>
							<CardTitle className="text-2xl">Paid Admin</CardTitle>
							<CardDescription>Full access to all features</CardDescription>
							<div className="mt-4">
								<span className="text-4xl font-bold text-blue-600">$99</span>
								<span className="text-gray-600">/month</span>
							</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-3 mb-6">
								<li className="flex items-start gap-2">
									<CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span className="text-sm font-medium">Full Admin Dashboard access</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span className="text-sm font-medium">School & Location Management</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span className="text-sm font-medium">Student Data & Analytics</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span className="text-sm font-medium">Scan Event Tracking</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span className="text-sm font-medium">Advanced Reports & Exports</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
									<span className="text-sm font-medium">Priority Support</span>
								</li>
							</ul>

							<Button
								size="lg"
								className="w-full text-lg"
								onClick={handleUpgrade}
								disabled={isProcessing}
							>
								{isProcessing ? (
									<>
										<div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
										Processing Payment...
									</>
								) : (
									<>
										<CreditCard className="size-5 mr-2" />
										Upgrade Now
									</>
								)}
							</Button>
						</CardContent>
					</Card>
				</div>

				<div className="max-w-3xl mx-auto">
					<Card className="bg-blue-50 border-none">
						<CardContent className="pt-6">
							<div className="flex items-start gap-4">
								<TrendingUp className="size-8 text-blue-600 flex-shrink-0" />
								<div>
									<h3 className="font-semibold text-gray-900 mb-2">Why Upgrade?</h3>
									<p className="text-gray-700">
										As a Paid Admin, you'll have complete control over your organization's attendance
										tracking system. Manage schools, locations, students, and view detailed scan event
										analytics. Export data for reports and gain insights into attendance patterns.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
