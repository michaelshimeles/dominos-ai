import Chat from '@/components/chat/chat';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getChatMessages } from './(server)/data/messages';
import { userInfo } from './(server)/data/user/user-info';

export default async function Home() {
  const { userId } = await auth()

  const { result } = await userInfo()

  if (!result?.address) {
    redirect("/profile")
  }

  const chatMessages = await getChatMessages(userId!)

  return (
    <div className="flex flex-col items-center justify-between w-full">
      {/** Chat list and Chat form */}
      <Chat userInfo={result!} chatMessages={chatMessages} />
    </div>
  );
}