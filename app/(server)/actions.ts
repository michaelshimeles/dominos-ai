"use server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "./db/db";
import { messages, users } from "./db/schema";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  unitNumber: z.string().optional(),
  unitType: z.string().optional(),
});

export async function submitOrder(prevState: any, formData: FormData) {
  const { userId } = await auth();
  const validatedFields = formSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    address: formData.get("address"),
    phoneNumber: formData.get("phoneNumber"),
    email: formData.get("email"),
    unitNumber: formData.get("unitNumber"),
    unitType: formData.get("unitType"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to submit the form. Please check the errors below.",
    };
  }

  // Here you would typically save the data to a database
  // For this example, we'll just return a success message

  await db
    .update(users)
    .set({
      firstName: validatedFields.data.firstName,
      lastName: validatedFields.data.lastName,
      address: validatedFields.data.address,
      phone: validatedFields.data.phoneNumber,
      email: validatedFields.data.email,
      unitNumber: validatedFields.data.unitNumber,
      unitType: validatedFields.data.unitType,
    })
    .where(eq(users.user_id, userId!));

  return {
    message: "Order information submitted successfully!",
  };
}

export async function clearChat(userId: string) {
  try {
    await db.delete(messages).where(eq(messages.user_id, userId));

    revalidatePath("/")
  } catch (error) {
    return error;
  }
}
