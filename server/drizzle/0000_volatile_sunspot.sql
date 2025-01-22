CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"role" text NOT NULL,
	"content" text,
	"tool_invocation" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	"phone" varchar,
	"address" text,
	"unit_number" text,
	"unit_type" text,
	"created_at" timestamp DEFAULT now(),
	"profile_image_url" text,
	"country" text,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
