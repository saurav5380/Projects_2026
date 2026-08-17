"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth } from "@/app/hooks/useAuth"


const SideBar = () => {
  const pathname = usePathname();
  const activeClassName = "h-10 px-3 rounded-md flex items-center bg-bg-subtle text-sm font-semibold text-text-primary border border-solid border-l-[3px] color-brand";
  const inactiveClassName = "h-10 px-3 rounded-md flex items-center text-sm font-medium text-text-secondary hover:bg-bg-subtle hover:text-text-primary";

  const isActive = (path: string) => {
    return `${pathname === path ? activeClassName : inactiveClassName}`
  }

  const { currentUser, currentUserError, currentUserDataIsPending } = useAuth();
  const userName = currentUser?.firstName;
  let displayUserName;
  if (userName) {
    displayUserName = userName?.charAt(0).toUpperCase() + userName?.slice(1);
  }
  const userAvatar = userName?.split("")[0].toUpperCase();

  return (
    <>

      <div className="border-r bg-bg-surface 1px border-DEFAULT  max-w-32 min-h-screen overflow-hidden">
        <div className="px-3 mt-6 mb-2 flex flex-col justify-start items-center gap-4">LEARNING
          <Separator />
          <Link href="/dashboard" className={isActive("/dashboard")}>
            Dashboard
          </Link>
          <Link href="/roadmap" className={isActive("/roadmap")}>
            Roadmap
          </Link>
          <Link href="/history" className={isActive("/history")}>
            History
          </Link>
        </div>
        <div className="px-3 mt-6 mb-2 flex flex-col justify-start items-center gap-4">ACCOUNT
          <Separator />
          <Link href="/settings" className={isActive("/settings")}>Settings</Link>
          <Link href="/bookmarks" className={isActive("/bookmarks")}>Bookmarks</Link>
          <div className="mt-16">
            {currentUserDataIsPending ? <span className="text-text-secondary">Fetching data...</span> :
              currentUserError ? <p className="text-danger">Error fetching user data!</p> :
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{userAvatar}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-text-secondary">{userName ? displayUserName : ""}</span>
                </div>
            }
          </div>

        </div>
      </div>

    </>
  )
}

export default SideBar;

