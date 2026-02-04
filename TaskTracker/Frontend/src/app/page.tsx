import Image from "next/image";
import { Database, TrendingUp, Zap, Users, ArrowRight } from 'lucide-react';
export default function Home() {
  return (
    <>
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black border border-b-zinc-50 ">
      <main className="flex w-full max-w-3xl items-center justify-between py-16 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/TaskTracker.svg"
          alt="Tasktracker logo"
          width={160}
          height={40}
          priority
        />
        <div className="flex gap-6 items-center justify-between">
          <button className="px-4 py-4 border border-zinc-50 mt-6  rounded-lg text-xl hover:cursor-pointer hover:text-orange-400 hover:border-orange-400 transition-all">Login</button>
          <button className="px-4 py-4 border border-zinc-50 mt-6 rounded-lg text-xl hover:cursor-pointer hover:text-orange-400 hover:border-orange-400 transition-all">Signup</button>
        </div>
      </main>  
    </div>
    <div className="flex flex-col w-full">
        <h2 className="p-4 text-center text-5xl font-extrabold">Organize Your Day, Track Your Progress</h2>
        <h3 className="p-4 text-center text-2xl font-bold">A simple daily task list app that helps you stay focused and productive</h3>
    </div>
    <div className="flex gap-6 justify-center p-4">
    <button className="px-4 py-4 border border-zinc-50  rounded-lg text-lg hover:cursor-pointer hover:text-orange-400 hover:border-orange-400 transition-all">Get Started Free</button>
    <button className="px-4 py-4 border border-zinc-50  rounded-lg text-lg hover:cursor-pointer hover:text-orange-400 hover:border-orange-400 transition-all"> Watch Demo</button>
    </div>
    <div className="flex items-center justify-center">
    <div className="relative w-full max-w-lg h-64 flex items-center justify-center m-4">
      <Image src="/hero.png"
      alt="Hero Image"
      layout="fill"
      objectFit="cover"
      className="rounded-lg shadow-xl"
      />
    </div>
    </div>
    <section className="relative w-full max-w-lg">
      <h2 className="">Features That Keep You Productive</h2>
      <div>

      </div>
    </section>
    </>
  );
}
