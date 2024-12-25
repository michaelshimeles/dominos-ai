"use client"
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Navbar() {

  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const text = textRef.current;
      const characters = text.textContent?.split("") || [];

      text.innerHTML = "";

      characters.forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline-block";
        if (char === " ") {
          span.style.width = "0.25em";
        }
        text.appendChild(span);
      });

      gsap.from(text.children, {
        opacity: 0,
        y: 20,
        rotation: 90,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
      });
    }
  }, []);



  return (
    <div className='flex justify-between items-center w-full  px-4 py-3 border-b'>
      <Link href="/" className="flex items-center gap-2">
        <span>🍕 </span>
        <h1 className='font-semibold text-lg' ref={textRef}>AI Pizza Agent</h1>
      </Link>
      <div className="flex justify-end items-center gap-6">
        <Link href="/profile">
          <h1 className="font-medium text-sm text-gray-700 hover:text-black">Profile</h1>
        </Link>
        <Link href="/orders">
          <h1 className="font-medium text-sm text-gray-700 hover:text-black">Orders</h1>
        </Link>
      </div>
    </div>

  )
}
