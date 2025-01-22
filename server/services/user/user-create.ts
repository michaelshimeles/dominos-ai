"server only";

import { db } from "../../db/db";
import { users } from "../../db/schema";

export const userCreate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  user_id,
}: {
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  user_id: string;
}) => {
  try {
    await db.insert(users).values({
      email,
      firstName: first_name,
      lastName: last_name,
      profile_image_url,
      user_id,
    });

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
