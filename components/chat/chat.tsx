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
import { useEffect, useRef } from 'react';
import ChatMessage from './chat-message';



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
  chatMessages?: any,
}) {
  const { signOut } = useClerk();
  const { messages, isLoading, input, handleInputChange, handleSubmit } = useChat({
    body: {
      userInfo
    },
    initialMessages: chatMessages,
    id: "store-select",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="flex flex-col w-full max-w-screen-md h-[calc(100vh)] px-4 mt-[5rem] mb-[5rem] overflow-y-auto scrollbar-hide">
        {messages.map((message, index) => (
          <main key={index}>
            <ChatMessage message={message} isLoading={isLoading} userInfo={userInfo} />
          </main>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 w-full dark:bg-[#0a0a0b] z-[99] fixed bottom-0 border-t border-t-zinc-900" >
        <div className="flex justify-center items-end gap-4 w-full">
          <div className='hidden lg:flex items-end justify-start space-x-4 w-full '>
            <Link href="https://rasmic.xyz" target='_blank' className="text-xs font-semibold ">rasmic.xyz © 2024</Link>
            <Link href="/profile" className="text-xs font-semibold hover:underline">profile ↗</Link>
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
                className="w-full px-4 py-2 rounded-full dark:bg-zinc-800 focus:outline-none"
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
      </div>
    </>
  );
}