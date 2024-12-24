ALTER TABLE "chat_participants" ALTER COLUMN "chat_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "chat_participants" ADD COLUMN "character_id" integer;