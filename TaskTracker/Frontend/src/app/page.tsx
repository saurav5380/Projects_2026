import Image from "next/image";
import { ListChecks, ClipboardClock, BellRing, ChartNoAxesCombined, RefreshCcw, Goal } from 'lucide-react';
export default function Home() {
  
  const features = [
    {
      icon: <ListChecks className="w-6 h-6" />,
      title: "Daily Task List",
      description: "Keep every day organized with task list"
    },
    {
      icon: <ClipboardClock className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Track Your Progress and make each day count"
    },
    {
      icon: <BellRing className="w-6 h-6" />,
      title: "Smart Reminders",
      description: "In-built reminders help you keep on track for task completion"
    },
    {
      icon: <ChartNoAxesCombined className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Measure your productivity through the in-built Analytics Dashboard"
    },
    {
      icon: <RefreshCcw className="w-6 h-6" />,
      title: "Cross Platform Sync",
      description: "Keep track of your tasks on multiple platforms"
    },
    {
      icon: <Goal className="w-6 h-6" />,
      title: "Habit Streaks",
      description: "Get rewarded for maintaining habits"
    }
  ]
  
  return (
    <>
    <div className="flex items-center  bg-zinc-50 font-sans dark:bg-black border border-b-zinc-50 ">
      <h1 className="text-7xl font-extrabold justify-items-start mx-6">TaskTracker</h1>
      <main className="flex w-full items-center py-8 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex gap-6 ml-auto">
          <button className="px-4 py-4 border border-zinc-50 mt-6  rounded-lg text-xl hover:cursor-pointer hover:text-[#085feb] hover:border-[#3b82f6] hover:-translate-y-1 transition-all">Login</button>
          <button className="px-4 py-4 border border-zinc-50 mt-6 rounded-lg text-xl hover:cursor-pointer hover:text-[#085feb] hover:border-[#3b82f6] hover:-translate-y-1 transition-all">Signup</button>
        </div>
      </main>  
    </div>
    <div className="flex flex-col w-full">
        <h2 className="p-4 text-center text-5xl font-extrabold">Organize Your Day, Track Your Progress</h2>
        <h3 className="p-4 text-center text-2xl font-bold">A simple daily task list app that helps you stay focused and productive</h3>
    </div>
    <div className="flex gap-6 justify-center p-4">
    <button className="px-4 py-4 border border-zinc-50  rounded-lg text-lg hover:cursor-pointer hover:text-[#085feb] hover:border-[#3b82f6] transition-all">Get Started Free</button>
    <button className="px-4 py-4 border border-zinc-50  rounded-lg text-lg hover:cursor-pointer hover:text-[#085feb] hover:border-[#3b82f6] transition-all"> Watch Demo</button>
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
    <div className="flex flex-col justify-center items-center w-full my-4 bg-slate-100 m-2">
      <h2 className="p-4 text-center text-5xl font-extrabold">Features That Keep You Productive</h2>
      <div className="grid grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="p-6 bg-slate-100 border border-[#334155] rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 group hover:cursor-pointer">
            <div className="w-12 h-12 bg-[#3b82f6]/10 text-[#3b82f6] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#3b82f6] group-hover:text-white transition-colors">
                  {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
            </h3>
            <p className="text-text-secondary leading-relaxed">
                  {feature.description}
            </p>
          </div>
        ))}
      </div>
      <div className="p-4 mt-6 flex flex-col bg-slate-200 w-full">
      <h2 className="p-4 text-center text-5xl font-extrabold"> Ready to Get Organised </h2>
      <h3 className="p-4 text-center text-2xl font-bold">Join Thousands of users who organise their day using TaskTracker</h3>
      <button className="p-6 border border-zinc-50 rounded-lg bg-zinc-100 w-72 mx-auto hover:cursor-pointer hover:text-[#085feb] hover:border-[#3b82f6] hover:-translate-y-1 transition-all">Start your Free Trial</button>
      </div>
    </div>
    <div className="flex items-center justify-center m-6">
      <a className="m-4 hover:cursor-pointer">About</a>
      <a className="m-4 hover:cursor-pointer">Privacy</a>
      <a className="m-4 hover:cursor-pointer">Terms</a>
      <a className="m-4 hover:cursor-pointer">Support</a>
    </div>
    </>
  );
}
