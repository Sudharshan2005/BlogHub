"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/contexts/user-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { User, Settings, LogOut, BarChart3, Edit } from "lucide-react"
import mongoose from "mongoose"
import { useRouter } from "next/navigation"

interface User {
  name: string;
  email: string;
  password?: string;
  avatar: string;
  bio: string;
  googleId?: string;
  githubId?: string;
  isVerified: boolean;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  bookmarks: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export function UserNav() {
  const router = useRouter()
  const [userDetails, setUserDetails] = useState<User>();

  useEffect(() => {
    const fetchData = async () => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
        const res = await fetch('/api/user/fetch', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        setUserDetails(data.user);
    };

    fetchData();
}, []);

const handlelogout = () => {
  sessionStorage.removeItem('token');
  router.push('/');
}

  if (!userDetails) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userDetails?.avatar || "/placeholder.svg"} alt={userDetails?.name || "User"} />
            <AvatarFallback>{userDetails.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userDetails?.name || "Unknown User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{userDetails?.email || "Unknown Email"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/create">
            <Edit className="mr-2 h-4 w-4" />
            Write
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlelogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
