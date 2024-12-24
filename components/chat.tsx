'use client';

import { clearChat } from '@/app/(server)/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useClerk } from '@clerk/nextjs';
import { useChat } from 'ai/react';
import { Send } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import CreditCardForm from './credit-card';

export default function Chat({ userInfo, chatMessages }: {
  userInfo?: {
    id: number,
    user_id: string | null,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    createdAt: Date | null,
    profile_image_url: string | null
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chatMessages?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) {
  const { signOut } = useClerk()


  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      userInfo
    },
    initialMessages: chatMessages,
  });

  return (
    <>
      <div className="flex flex-col w-full max-w-screen-md min-h-[80vh] px-4 my-[5rem]">
        {messages.map((m, index) => {
          console.log('m.toolInvocations', JSON.stringify(m.toolInvocations, null, 2))

          return (<main key={index}>
            <div className={m.role === 'user' ? 'flex items-start w-full gap-2 mb-4 justify-end' : 'flex items-start w-full gap-2 mb-4 justify-start'}>
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={m.role === "user" ? userInfo?.profile_image_url! : "https://utfs.io/f/MD2AM9SEY8GucPis22p5qyE7FjNDKYduLOG2QHWh3f5RgSi0"}
                  alt="User"
                  width={32}
                  height={32}
                  quality={95}
                  sizes={"48px"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`${m.role !== "user" ? "bg-gray-100" : "bg-black text-white"} flex flex-col rounded-2xl p-3 max-w-[80%]`}>
                <p>
                  {m.content}

                </p>
                {m.toolInvocations?.map(toolInvocation => {
                  const { toolName, toolCallId, state } = toolInvocation;
                  console.log('toolName', toolName)
                  console.log('toolCallId', toolCallId)
                  console.log('state', state)

                  if (toolName === 'order') {
                    // Render the form immediately when payment is requested
                    return (
                      <div className='flex justify-start items-start mt-[1rem]' key={toolCallId}>
                        <CreditCardForm userInfo={userInfo} messages={messages} />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </main>)
        })}
      </div>

      {/* Footer */}
      <footer className="p-2 w-full bg-white fixed bottom-0">
        <div className="flex justify-center items-end gap-4 w-full">
          <div className='hidden lg:flex items-end justify-start space-x-4 w-full '>
            <Link href="https://rasmic.xyz" target='_blank' className="text-xs font-semibold ">rasmic.xyz © 2024</Link>
            <Link href="/profile" className="text-xs font-semibold hover:underline">profle ↗</Link>
          </div>
          <div
            className="flex justify-center items-center w-full gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <Image
                    src={userInfo?.profile_image_url!}
                    alt="User"
                    width={32}
                    height={32}
                    quality={95}
                    sizes={"48px"}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href="/profile">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={async () => await clearChat(userInfo?.user_id!)}>Clear Chat</DropdownMenuItem>
                <DropdownMenuItem className='text-red-600 hover:text-red-400 font-semibold' onClick={() => signOut({ redirectUrl: '/' })}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <form onSubmit={handleSubmit} className='flex justify-center items-center w-full gap-2'>
              <input
                type="text"
                placeholder="Message"
                className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none"
                value={input}
                onChange={handleInputChange}
              />
              <Button size="icon" variant="ghost">
                <Send />
              </Button>
            </form>
          </div>
          <div className='hidden lg:flex items-end justify-end space-x-4 w-full'>
            <Link target='_blank' href="https://x.com/rasmickyy" className="text-xs font-semibold hover:underline">X ↗</Link>
            <Link target='_blank' href="https://www.youtube.com/@rasmic" className="text-xs font-semibold hover:underline">YouTube ↗</Link>
          </div>
        </div>
      </footer>
    </>
  )
}