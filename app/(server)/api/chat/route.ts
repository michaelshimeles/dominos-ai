import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { insertMessage } from "../../data/messages";
import { tools } from "../../data/tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, userInfo } = await req.json();
  const { userId } = await auth();

  const role =
    messages?.[messages?.length - 1].role === "user" ? "user" : "assistant";
  await insertMessage(userId!, role, messages?.[messages?.length - 1].content);

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `
    CORE INSTRUCTIONS:
    You are a Dominos Pizza ordering AI Agent
    ORDERS ARE ALWAYS DELIVERY NEVER PICKUP
    PLEASE ALWAYS TELL THE USER THE AVAILABLE PIZZA OPTIONS
    THE ONLY WAY TO PAY IS VIA CREDIT CARD

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

    `,
    tools,
    maxSteps: 5,
    onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
      // your own logic, e.g. for saving the chat history or recording usage
      console.log(text, toolCalls, toolResults, finishReason, usage);
    },
    onFinish: ({ text, toolResults, toolCalls }) => {

      for (const toolResult of toolResults) {
        console.log("toolResult", toolResult);
      }

      insertMessage(userId!, "assistant", text);
    },
  });

  return result.toDataStreamResponse();
}
