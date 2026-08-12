import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {useAuth} from "@/app/hooks/useAuth"
import { ChevronDown } from "lucide-react";

const TopBar = () => {

    const {currentUser, currentUserError, currentUserDataIsPending, logout} = useAuth();
    const userName = currentUser?.data.firstName;
    const userAvatar = userName?.split("")[0];
    
    return (
        <>
        {currentUserError? <p>Error fetching user data</p> : 
            currentUserDataIsPending ? <span>Fetching data...</span> : 
                <div>
                <Avatar>
                    <AvatarFallback>{userAvatar}</AvatarFallback>
                </Avatar>
                <DropdownMenuTrigger>
                    <ChevronDown/>
                    <DropdownMenu>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>settings</DropdownMenuItem>
                            <DropdownMenuItem>
                                <Button size="sm" variant="outline" type="submit" onSubmit={() => logout}>Logout</Button>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenu>
                </DropdownMenuTrigger>
                </div>
        }
        </>
    )
}

export default TopBar;


