"use client";

import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconCloud,
  IconFlower,
  IconDoorExit,
  IconUsersGroup,
  IconShovel,
  IconHome,
  IconDoorEnter,
  IconBrandGoogleAnalytics,
} from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  currentUser: {
    full_name: string;
    avatar_url: string;
  } | null;
}

export default function ClientLayoutWrapper({
  children,
  currentUser,
}: ClientLayoutWrapperProps) {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconHome className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: (
        <IconBrandGoogleAnalytics className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Gardens",
      href: "/gardens",
      icon: (
        <IconShovel className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Teams",
      href: "/teams",
      icon: (
        <IconUsersGroup className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Weather",
      href: "#",
      icon: (
        <IconCloud className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Plant Explorer",
      href: "/plant-explorer",
      icon: (
        <IconFlower className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: currentUser ? "Logout" : "Login",
      href: currentUser ? "/auth/logout" : "/auth/login",
      icon: currentUser ? (
        <IconDoorExit className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ) : (
        <IconDoorEnter className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          {currentUser && (
            <div>
              <SidebarLink
                link={{
                  label: currentUser.full_name,
                  href: "#",
                  icon: currentUser.avatar_url ? (
                    <Image
                      src={currentUser.avatar_url}
                      className="h-7 w-7 shrink-0 rounded-full object-cover"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center shrink-0 rounded-full bg-neutral-400 text-white text-sm font-semibold">
                      {currentUser.full_name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  ),
                }}
              />
            </div>
          )}
        </SidebarBody>
      </Sidebar>

      <main className="flex flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
