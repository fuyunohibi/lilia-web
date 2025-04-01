"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const notifications = [
  "⚠️ Low temperature detected in Tomato Bed (14°C)",
  "🚫 No water detected in Herb Garden reservoir",
  "🔔 Scheduled watering completed for Rose Patch",
  "✅ Fan successfully activated in Greenhouse Zone 1",
  "💡 Light levels are below optimal in Lettuce Tray (120 lx)",
  "📦 New sensor data synced from Raspberry Pi controller",
];

export function NotificationBell() {
  return (
    <div className="absolute top-3 right-16 md:top-4 md:right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="rounded-full p-0 md:p-2 md:bg-white/80 dark:bg-neutral-800 hover:bg-white dark:hover:bg-neutral-700 md:shadow-sm transition relative"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5 text-neutral-800 dark:text-white" />
            <span className="absolute top-0 right-0 md:right-1.5 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="absolute top-0 right-0 md:right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="left"
          align="end"
          className="mt-12 w-80 p-4 shadow-md rounded-3xl overflow-hidden bg-neutral-800/10 backdrop-blur-xl transition-all duration-300"
        >
          <div className="text-sm font-semibold text-neutral-800 dark:text-white mb-3">
            🔔 Notifications
          </div>
          <ScrollArea className="h-60">
            {notifications.length === 0 ? (
              <div className="text-neutral-500 italic text-sm">
                No new notifications.
              </div>
            ) : (
              notifications.map((note, index) => (
                <div
                  key={index}
                  className="bg-white/40 dark:bg-neutral-700/40 rounded-xl px-4 py-3 text-sm text-neutral-800 dark:text-neutral-200 shadow-sm backdrop-blur-md mb-2"
                >
                  {note}
                </div>
              ))
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
