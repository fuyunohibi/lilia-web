"use client";

import React, { useState } from "react";
import { signout } from "@/actions/auth/authentication.actions";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signout();
    } catch (error) {
      console.error("Error logging out", error);
    } finally {
      setLoggingOut(false);
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogTitle className="text-center text-xl font-semibold text-neutral-800 dark:text-neutral-100">
          Logout
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-neutral-500">
          Are you sure you want to logout?
        </DialogDescription>

        <DialogFooter>
          <button
            type="submit"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full rounded-full bg-black px-4 py-2 text-white hover:opacity-90"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </DialogFooter>

        <DialogClose className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600">
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutPage;
