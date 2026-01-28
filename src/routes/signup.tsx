import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { signup } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/signup")({
	component: SignupPage,
});

const formSchema = z.object({
	full_name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	confirm_password: z.string(),
	organization_name: z.string().min(2, "Organization name must be at least 2 characters"),
	phone: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
	message: "Passwords don't match",
	path: ["confirm_password"],
});

type FormData = z.infer<typeof formSchema>;

function SignupPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { login: authLogin } = useAuth();
	const navigate = useNavigate();

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			full_name: "",
			email: "",
			password: "",
			confirm_password: "",
			organization_name: "",
			phone: "",
		},
	});

	async function onSubmit(values: FormData) {
		setIsSubmitting(true);
		setError(null);

		try {
			const result = await signup({
				full_name: values.full_name,
				email: values.email,
				password: values.password,
				organization_name: values.organization_name,
				phone: values.phone || undefined,
			});

			if (result.success && result.user) {
				authLogin(result.user);
				navigate({ to: "/" });
			} else {
				setError(result.error || "Signup failed");
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
			setError(errorMessage);
			console.error("Signup error:", err);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
			<Card className="max-w-md w-full">
				<CardHeader>
					<div className="flex items-center gap-2 mb-2">
						<UserPlus className="size-6 text-blue-600" />
						<CardTitle className="text-2xl">Create Account</CardTitle>
					</div>
					<CardDescription>
						Sign up for HallGuardian to get started
					</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert variant="destructive" className="mb-6">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="full_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name *</FormLabel>
										<FormControl>
											<Input placeholder="John Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Address *</FormLabel>
										<FormControl>
											<Input type="email" placeholder="john@school.edu" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="organization_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>School/Organization Name *</FormLabel>
										<FormControl>
											<Input placeholder="Lincoln High School" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number (Optional)</FormLabel>
										<FormControl>
											<Input type="tel" placeholder="(555) 123-4567" {...field} value={field.value || ""} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password *</FormLabel>
										<FormControl>
											<Input type="password" placeholder="••••••••" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirm_password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password *</FormLabel>
										<FormControl>
											<Input type="password" placeholder="••••••••" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? "Creating Account..." : "Sign Up"}
							</Button>
						</form>
					</Form>

					<div className="mt-6 text-center text-sm text-gray-600">
						Already have an account?{" "}
						<Link to="/login" className="text-blue-600 hover:underline font-medium">
							Log in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
