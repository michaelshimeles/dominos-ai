ALTER TABLE "character" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "chat_participants" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "chats" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "character" CASCADE;--> statement-breakpoint
DROP TABLE "chat_participants" CASCADE;--> statement-breakpoint
DROP TABLE "chats" CASCADE;--> statement-breakpoint
ALTER TABLE "messages" RENAME COLUMN "chat_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "name" TO "first_name";--> statement-breakpoint
DROP INDEX "idx_messages_chat_id";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "unit_number" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "unit_type" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_unique" UNIQUE("phone");