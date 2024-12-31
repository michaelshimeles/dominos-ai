import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { messages } from "../db/schema";

// Insert a message
export const insertMessage = async (
  userId: string,
  role: "user" | "assistant",
  content: string
) => {
  const [{ id }] = await db
    .insert(messages)
    .values({
      user_id: userId,
      role,
      content,
    })
    .returning();

  return id;
};

export async function saveToolResult(userId: string, toolResult: any) {
  await db.insert(messages).values({
    user_id: userId,
    role: "assistant",
    toolInvocations: [toolResult],
  });
}

// Fetch chat messages
export const getChatMessages = async (user_id: string) => {
  return await db
    .select()
    .from(messages)
    .where(eq(messages.user_id, user_id))
    .orderBy(messages.createdAt);
};
