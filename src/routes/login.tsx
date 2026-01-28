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
import { login } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn } from "lucide-react";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

const formSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof formSchema>;

function LoginPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { login: authLogin } = useAuth();
	const navigate = useNavigate();

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: FormData) {
		setIsSubmitting(true);
		setError(null);

		try {
			const result = await login(values.email, values.password);

			if (result.success && result.user) {
				authLogin(result.user);
				navigate({ to: "/" });
			} else {
				setError(result.error || "Login failed");
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
			setError(errorMessage);
			console.error("Login error:", err);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
			<Card className="max-w-md w-full">
				<CardHeader>
					<div className="flex items-center gap-2 mb-2">
						<LogIn className="size-6 text-blue-600" />
						<CardTitle className="text-2xl">Welcome Back</CardTitle>
					</div>
					<CardDescription>
						Log in to your HallGuardian account
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
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Address</FormLabel>
										<FormControl>
											<Input type="email" placeholder="john@school.edu" {...field} />
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
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" placeholder="••••••••" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? "Logging in..." : "Log In"}
							</Button>
						</form>
					</Form>

					<div className="mt-6 text-center text-sm text-gray-600">
						Don't have an account?{" "}
						<Link to="/signup" className="text-blue-600 hover:underline font-medium">
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
