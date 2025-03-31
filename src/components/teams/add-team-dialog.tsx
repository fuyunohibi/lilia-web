"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { getAllUsers } from "@/actions/users/users.actions";
import { addTeam } from "@/actions/teams/teams.actions";
import { toast } from "sonner";

function AddTeamDialog({ currentUser }: { currentUser: any }) {
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers();
      if (result.data) setAllUsers(result.data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fUsers = allUsers.filter((user) => {
      const matches = user.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const isNotSelf = user.user_id !== currentUser?.user_id;
      return matches && isNotSelf;
    });
    setFilteredUsers(fUsers);
  }, [searchTerm, allUsers, currentUser]);

  const handleToggleUser = (userId: string) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast.error("Please enter a team name.");
      return;
    }

    const allMembers = members.includes(currentUser.user_id)
      ? members
      : [...members, currentUser.user_id];

    try {
      await addTeam({ teamName: teamName.trim(), members: allMembers });
      toast.success("Team added successfully!");
      setOpen(false);
      setTeamName("");
      setMembers([]);
      setSearchTerm("");
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full bg-black px-4 py-2 text-white hover:opacity-90">
          + Add Team
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-center text-xl font-semibold text-neutral-800 dark:text-neutral-100">
          Create New Team
        </DialogTitle>
        <DialogDescription className="text-center text-sm text-neutral-500">
          Give your team a name and invite members
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-200 mb-1 block">
              Team Name
            </label>
            <input
              type="text"
              placeholder="e.g. Dream Gardeners"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-200 mb-1 block">
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <div className="max-h-40 overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-700 p-2 bg-white dark:bg-neutral-900">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.user_id}
                  onClick={() => handleToggleUser(user.user_id)}
                  className={`flex items-center gap-2 p-2 cursor-pointer rounded-lg transition ${
                    members.includes(user.user_id)
                      ? "bg-black text-white"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.username}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-400 text-white text-sm font-semibold">
                      {user.username?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <span className="text-sm">{user.username}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No users found.</p>
            )}
          </div>

          <DialogFooter>
            <button
              type="submit"
              className="w-full rounded-full bg-black px-4 py-2 text-white hover:opacity-90"
            >
              Add Team
            </button>
          </DialogFooter>
        </form>

        <DialogClose className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600">
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default AddTeamDialog;
