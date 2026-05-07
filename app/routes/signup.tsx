import { Banner, Button, Input } from "@cloudflare/kumo";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";

export default function Signup() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const result = await authClient.signUp.email({
			email,
			password,
			name,
		});

		if (result.error) {
			setError(result.error.message ?? "Sign up failed");
			setLoading(false);
			return;
		}

		navigate("/");
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
				<h1 className="text-2xl font-semibold">Create account</h1>

				{error && <Banner variant="error">{error}</Banner>}

				<Input
					type="text"
					placeholder="Your name"
					value={name}
					onChange={(e) => setName(e.currentTarget.value)}
					required
				/>

				<Input
					type="email"
					placeholder="you@example.com"
					value={email}
					onChange={(e) => setEmail(e.currentTarget.value)}
					required
				/>

				<Input
					type="password"
					placeholder="Password (min 8 chars)"
					value={password}
					onChange={(e) => setPassword(e.currentTarget.value)}
					required
					minLength={8}
				/>

				<Button type="submit" disabled={loading}>
					{loading ? "Creating account…" : "Sign up"}
				</Button>

				<div className="text-sm text-center">
					Already have an account?{" "}
					<Link to="/login" className="underline">
						Sign in
					</Link>
				</div>
			</form>
		</div>
	);
}
