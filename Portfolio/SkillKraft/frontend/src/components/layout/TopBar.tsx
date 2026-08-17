"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {useAuth} from "@/app/hooks/useAuth"
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import * as authHelpers from "@/lib/auth"

const TopBar = () => {

    const {currentUser, currentUserError, currentUserDataIsPending, logout} = useAuth();
    const userName = currentUser?.firstName;
   
    const userAvatar = userName?.split("")[0].toUpperCase();
    
    return (
        <>
        <div className="flex justify-between mt-4 border-b border-border-soft w-full">
            <div className="h-14 px-5">
                <Image src="/skillkraft-growth-steps-transparent.svg" width={32} height={32} alt="SkillKraft Logo"/>
                 <h1 className="text-primary text-3xl font-bold">SkillKraft</h1>
            </div>
        {currentUserDataIsPending ? <span className="text-text-secondary">Fetching data...</span>: 
             currentUserError? <p className="text-danger">Error fetching user data!</p>: 
                <div className="flex justify-end p-4 ">
                <Avatar>
                    <AvatarFallback>{userAvatar}</AvatarFallback>
                </Avatar>
                <DropdownMenu>
                <DropdownMenuTrigger>
                    <ChevronDown/>
                        <DropdownMenuGroup>
                            <DropdownMenuContent>
                            <DropdownMenuItem>settings</DropdownMenuItem>
                            <DropdownMenuItem>
                                <Button size="sm" variant="outline" onClick={() => logout(authHelpers.getRefreshToken() || "")}>Logout</Button>
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenuGroup>
                </DropdownMenuTrigger>
                 </DropdownMenu>
                </div>
        }
        </div>
        </>
    )
}

export default TopBar;


