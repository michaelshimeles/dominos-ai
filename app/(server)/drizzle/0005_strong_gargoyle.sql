ALTER TABLE "character" DROP CONSTRAINT "character_session_id_unique";--> statement-breakpoint
ALTER TABLE "character" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "character" DROP COLUMN "session_id";