"server only";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { users } from "../../db/schema";

export const userInfo = async () => {
  const { userId } = await auth();

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.user_id, userId!));
    return {
      success: true,
      result: result?.[0],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      result: null,
      error,
    };
  }
};
