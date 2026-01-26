"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(name?: string | null, email?: string | null): string {
    if (name) {
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
    if (email) {
        return email.substring(0, 2).toUpperCase();
    }
    return "U";
}

export default function UserAvatar() {
    const { data: session } = useSession();

    if (!session?.user) return null;

    const initials = getInitials(session.user.name, session.user.email);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    {initials}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-muted-foreground border-b border-border mb-1">
                    {session.user.email}
                </div>
                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
