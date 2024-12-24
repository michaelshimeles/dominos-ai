'use client';

export default function LoadingIndicator({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-gray-500">{message}</p>
      <div className="loader mt-4"></div> {/* Replace with a spinner */}
    </div>
  );
}
