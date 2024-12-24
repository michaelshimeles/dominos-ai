ALTER TABLE "chat_participants" ALTER COLUMN "chat_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "chat_participants" ALTER COLUMN "chat_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "chat_id" SET DATA TYPE integer;