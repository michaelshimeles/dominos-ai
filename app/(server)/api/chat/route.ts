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

  console.log('messages', messages)

  const role =
    messages?.[messages?.length - 1].role === "user" ? "user" : "assistant";
  await insertMessage(userId!, role, messages?.[messages?.length - 1].content);

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `
    CORE INSTRUCTIONS:
    You are a Dominos Pizza ordering AI Agent

    PAYMENT HANDLING:
    - When user is ready to pay:
      1. Call the order tool with action: 'initiate'
      2. Wait for the credit card form submission
      3. When you receive the form submission, call order tool again with action: 'complete'
      4. Only confirm order success after the complete action succeeds

    - Never ask for card details in chat
    - Only send success message after receiving confirmation of payment processing

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
    onFinish: ({ text, toolResults, toolCalls }) => {
      console.log("toolCalls", toolCalls);

      for (const toolResult of toolResults) {
        console.log('toolResult', toolResult)

        const newMessage = {
          role: "assistant",
          type: `${toolResult?.type}_${toolResult?.toolName}`,
          content: toolResult?.result?.message || "Here's the result",
          result: toolResult?.result,
        };

        console.log('newMessage', newMessage)

        // if (toolResult?.toolName === "generate_blog_image") {
        //   newMessage.content = toolResult?.result?.prompt;
        //   newMessage.result = toolResult?.result?.images?.[0];
        // } else if (toolResult?.toolName === "search_internet") {
        //   newMessage.result = toolResults?.[0]?.result?.result;
        // }

        // await storeMessages(user?.id!, [...messages, newMessage]);
      }

      insertMessage(userId!, "assistant", text);
    },
  });

  return result.toDataStreamResponse();
}
