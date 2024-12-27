'use client';

import Image from "next/image";
import { memo } from 'react';
import ListStores from '../list-stores';
import { Markdown } from '../markdown';
import { PaymentFormCard } from '../payment-form';
import PizzaCard from '../pizza-card';

// Memoized message component
export default memo(function ChatMessage({
  message,
  userInfo,
  isLoading
}: {
  message: any,
  userInfo: any,
  isLoading: any
}) {

  return (
    <div className={message.role === 'user' ? 'flex items-start w-full gap-2 mb-4 justify-end' : 'flex items-start w-full gap-2 mb-4 justify-start'}>
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={message.role === "user" ? userInfo?.profile_image_url! : "https://fal.media/files/tiger/BDi3ce5HjvoM_kemH8SoC_d582395b8328469f8627628886318a08.jpg"}
          alt="User"
          width={32}
          height={32}
          quality={100}
          sizes={"48px"}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        {message.content && (
          <div className={`${message.role !== "user" ? "dark:bg-zinc-800 max-w-[70%]" : "bg-black text-white"} flex flex-col rounded-2xl p-3 max-w-[350px] w-full border dark:border-zinc-900`}>
            <Markdown>{message.content}</Markdown>
          </div>
        )}
        {message.toolInvocations?.map((toolInvocation: any, toolIndex: number) => {
          const toolName = toolInvocation?.toolName;

          switch (toolName) {
            case 'displayFood':
              return (
                <div key={`tool-${toolIndex}`} className='flex flex-wrap justify-start items-center w-full gap-2 rounded-2xl'>
                  {toolInvocation?.result?.orderItems?.map((order: any, orderIndex: number) => (
                    <div key={`order-${toolIndex}-${orderIndex}`} className='max-w-[300px] mt-2 w-fit'>
                      <PizzaCard
                        title={order?.name}
                        description={order?.description}
                        image={order?.imageUrl}
                      />
                    </div>
                  ))}
                </div>
              );

            case 'selectNearbyStore':
              return (
                <div key={`tool-${toolIndex}`} className='flex mt-2 w-fit flex-col p-3 rounded-2xl justify-center items-start dark:bg-zinc-800'>
                  <ListStores stores={toolInvocation?.result?.result?.storeInfo} />
                </div>
              );

            case 'processCardPayments':
              return (
                <div key={`tool-${toolIndex}`} className='flex mt-2 w-fit flex-col p-3 rounded-2xl justify-center items-start dark:bg-zinc-800'>
                  <PaymentFormCard />
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
});