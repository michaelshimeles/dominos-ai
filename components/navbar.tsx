"use client"
import { SignedIn } from "@clerk/nextjs";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ModeToggle } from "./mode-toggle";

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
    <div className='flex fixed top-0 justify-between items-center w-full dark:bg-[#0a0a0b] bg-white px-4 py-3 z-[50] border-b dark:border-b-zinc-900'>
      <Link href="/" className="flex items-center gap-2">
        <span>🍕 </span>
        <h1 className='font-semibold text-lg' ref={textRef}>AI Pizza Agent</h1>
      </Link>
      <div className="flex justify-end items-center gap-4">
        <SignedIn>
          <Link href="/profile">
            <h1 className="font-medium text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-200 hover:dark:text-zinc-400">Profile</h1>
          </Link>
        </SignedIn>
        <ModeToggle />
      </div>
    </div>

  )
}
