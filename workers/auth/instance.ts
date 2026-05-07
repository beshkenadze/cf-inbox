import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey } from "@better-auth/api-key";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/auth.schema";
import type { Env } from "../types";

type AuthInstance = {
	handler: (request: Request) => Promise<Response>;
	api: {
		getSession: (opts: {
			headers: Headers;
		}) => Promise<{ session: { id: string; userId: string }; user: { id: string; email: string } } | null>;
	};
};

export function createAuth(env: Env): AuthInstance {
	const db = drizzle(env.AUTH_DB, { schema });

	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "sqlite",
			schema: {
				user: schema.user,
				session: schema.session,
				account: schema.account,
				verification: schema.verification,
				apikey: schema.apikey,
			},
		}),

		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL ?? "https://inbox.bshk.app",

		emailAndPassword: {
			enabled: true,
			autoSignIn: true,
			minPasswordLength: 8,
		},

		session: {
			cookieCache: { enabled: true, maxAge: 60 },
			expiresIn: 60 * 60 * 24 * 30,
			updateAge: 60 * 60 * 24,
		},

		plugins: [
			apiKey({
				customAPIKeyGetter: (ctx) => {
					const header = ctx.request?.headers.get("authorization");
					return header?.startsWith("Bearer ") ? header.slice(7) : null;
				},
				enableSessionForAPIKeys: true,
			}),
		],

		trustedOrigins: [
			"https://inbox.bshk.app",
			"http://localhost:5173",
			"http://localhost:8787",
		],
	}) as unknown as AuthInstance;
}

export type Auth = AuthInstance;
