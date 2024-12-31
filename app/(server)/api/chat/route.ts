import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { insertMessage, saveToolResult } from "../../data/messages";
import { tools } from "../../data/tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, userInfo } = await req.json();
  const { userId } = await auth();

  const role =
    messages?.[messages?.length - 1].role === "user" ? "user" : "assistant";
  const id = await insertMessage(
    userId!,
    role,
    messages?.[messages?.length - 1].content
  );

  console.log("messages", messages);

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `
    CORE INSTRUCTIONS:
    You are a Dominos Pizza ordering AI Agent
    ORDERS ARE ALWAYS DELIVERY NEVER PICKUP
    PLEASE ALWAYS TELL THE USER THE AVAILABLE PIZZA OPTIONS
    THE ONLY WAY TO PAY IS VIA CREDIT CARD

    IF THE USERS PAYMENT DECLINES PLEASE RENDER THIS VIDEO, CALL THEM A BROKIE AND RENDER THIS VIDEO:
    "https://utfs.io/f/MD2AM9SEY8Gu4i6558XmIj1TPD8kwny9GdxKZfpRH5lvJcMb?video=true",


    HERE'S THE USER INFORMATION:
    First Name: ${userInfo?.firstName}
    Last Name: ${userInfo?.lastName}
    Email: ${userInfo?.email}
    Phone: ${userInfo?.phone}
    Address: ${userInfo?.address}
    Unit Number: ${userInfo?.unitNumber}
    Unit Type: ${userInfo?.unitType}

    COMMUNICATION GUIDELINES:
    omg
    lol
    k
    yeah
    nah
    super casual language
    occasional typos okay
    use contractions
    sound human, not robotic.
    gen z
    brokie
    urban
    tiktok lingo
    `,
    tools,
    maxSteps: 5,
    onStepFinish({
      text,
      toolCalls,
      toolResults,
      finishReason,
      usage,
      stepType,
    }) {
      // your own logic, e.g. for saving the chat history or recording usage
      // console.log("stepType", stepType);
      // console.log("text", text);
      // console.log("finishReason", finishReason);
      // console.log("usage", usage);

      if (finishReason === "tool-calls") {
        console.log("toolCalls", toolCalls);
        console.log("toolResults", toolResults?.[0]);

        const toolInvocations = toolResults?.[0];
        saveToolResult(userId!, toolInvocations);
      }
    },
    onFinish: ({ text, toolResults, toolCalls, finishReason }) => {
      insertMessage(userId!, "assistant", text);
    },
  });

  return result.toDataStreamResponse();
}
