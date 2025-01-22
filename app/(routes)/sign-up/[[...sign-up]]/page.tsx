import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex flex-col justify-center items-center w-full mt-[4rem]'>
      <SignUp />
    </div>
  )
}