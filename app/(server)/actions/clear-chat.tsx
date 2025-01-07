"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../db/db";
import { messages } from "../db/schema";

export async function clearChat(userId: string) {
  try {
    await db.delete(messages).where(eq(messages.user_id, userId));

    revalidatePath("/")
  } catch (error) {
    return error;
  }
}
