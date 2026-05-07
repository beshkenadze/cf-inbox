CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL UNIQUE,
	"emailVerified" integer DEFAULT 0 NOT NULL,
	"name" text,
	"image" text,
	"createdAt" integer NOT NULL,
	"updatedAt" integer NOT NULL
);

CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL UNIQUE,
	"expiresAt" integer NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" integer NOT NULL,
	"updatedAt" integer NOT NULL,
	FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"password" text,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" integer,
	"refreshTokenExpiresAt" integer,
	"scope" text,
	"createdAt" integer NOT NULL,
	"updatedAt" integer NOT NULL,
	FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" integer NOT NULL,
	"createdAt" integer,
	"updatedAt" integer
);

CREATE TABLE "apikey" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"start" text,
	"prefix" text,
	"key" text NOT NULL,
	"userId" text NOT NULL,
	"refillInterval" integer,
	"refillAmount" integer,
	"lastRefillAt" integer,
	"enabled" integer DEFAULT 1 NOT NULL,
	"rateLimitEnabled" integer DEFAULT 0 NOT NULL,
	"rateLimitTimeWindow" integer,
	"rateLimitMax" integer,
	"requestCount" integer DEFAULT 0 NOT NULL,
	"remaining" integer,
	"lastRequest" integer,
	"expiresAt" integer,
	"permissions" text,
	"metadata" text,
	"createdAt" integer NOT NULL,
	"updatedAt" integer NOT NULL,
	FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX "session_token_idx" ON "session"("token");
CREATE INDEX "session_userId_idx" ON "session"("userId");
CREATE INDEX "account_userId_idx" ON "account"("userId");
CREATE INDEX "apikey_key_idx" ON "apikey"("key");
CREATE INDEX "apikey_userId_idx" ON "apikey"("userId");
