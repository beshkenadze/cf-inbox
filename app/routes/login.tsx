import { Banner, Button, Input } from "@cloudflare/kumo";
import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { authClient } from "~/lib/auth-client";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirect = searchParams.get("redirect") ?? "/";

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const result = await authClient.signIn.email({
			email,
			password,
		});

		if (result.error) {
			setError(result.error.message ?? "Sign in failed");
			setLoading(false);
			return;
		}

		navigate(redirect);
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
				<h1 className="text-2xl font-semibold">Sign in</h1>

				{error && <Banner variant="error">{error}</Banner>}

				<Input
					type="email"
					placeholder="you@example.com"
					value={email}
					onChange={(e) => setEmail(e.currentTarget.value)}
					required
				/>

				<Input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.currentTarget.value)}
					required
				/>

				<Button type="submit" disabled={loading}>
					{loading ? "Signing in…" : "Sign in"}
				</Button>

				<div className="text-sm text-center">
					Don't have an account?{" "}
					<Link to="/signup" className="underline">
						Sign up
					</Link>
				</div>
			</form>
		</div>
	);
}
