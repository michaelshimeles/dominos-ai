ALTER TABLE "users" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_userId_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_id_unique" UNIQUE("user_id");