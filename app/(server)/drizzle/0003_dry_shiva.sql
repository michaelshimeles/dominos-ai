CREATE TABLE "character" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"session_id" text,
	"character_info" text,
	CONSTRAINT "character_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "character_session_id_unique" UNIQUE("session_id")
);
