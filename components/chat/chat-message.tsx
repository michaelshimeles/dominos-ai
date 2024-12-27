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
    <div className={message.role === 'user' ? 'flex items-start w-full gap-2 mb-[8px] justify-end' : 'flex items-start w-full gap-2 mb-[8px] justify-start'}>
      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={message.role === "user" ? userInfo?.profile_image_url! : "https://fal.media/files/tiger/BDi3ce5HjvoM_kemH8SoC_d582395b8328469f8627628886318a08.jpg"}
          alt="User"
          width={28}
          height={28}
          quality={100}
          sizes={"28px"}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        {message.content && (
          <div className={`${
            message.role === "user"
              ? "bg-[#007AFF] text-white rounded-[20px] rounded-tr-[4px]"
              : "bg-[#E9E9EB] dark:bg-[#1C1C1E] text-black dark:text-white rounded-[20px] rounded-tl-[4px]"
          } flex flex-col px-[12px] py-[8px] max-w-[280px] w-fit leading-[1.35]`}>
            <div className="text-[14px] py-1">
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        )}
        {message.toolInvocations?.map((toolInvocation: any, toolIndex: number) => {
          const toolName = toolInvocation?.toolName;

          console.log('toolInvocation?.result?.orderItems', toolInvocation?.result?.orderItems)

          switch (toolName) {
            case 'displayFood':
              return (
                <div key={`tool-${toolIndex}`} className='grid grid-cols-1 lg:grid-cols-2 w-full gap-2 rounded-2xl'>
                  {toolInvocation?.result?.orderItems?.map((order: any, orderIndex: number) => (
                    <div key={`order-${toolIndex}-${orderIndex}`} className='mt-2 w-fit'>
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