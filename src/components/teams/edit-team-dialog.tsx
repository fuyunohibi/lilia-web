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
import { updateTeam, removeTeamMember } from "@/actions/teams/teams.actions";
import { IconDots, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

type User = {
  user_id: string;
  username: string;
  avatar_url?: string;
};

type Team = {
  team_id: string;
  team_name: string;
  members: string[];
};

function EditTeamDialog({
  currentUser,
  team,
  onTeamUpdated,
}: {
  currentUser: User;
  team: Team;
  onTeamUpdated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState(team.team_name);
  const [members, setMembers] = useState<string[]>(team.members);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [confirmRemove, setConfirmRemove] = useState<User | null>(null);

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
      : [currentUser.user_id, ...members];

    try {
      await updateTeam({
        teamId: team.team_id,
        teamName: teamName.trim(),
        members: allMembers,
      });
      toast.success("Team updated successfully!");
      setOpen(false);
      onTeamUpdated?.();
    } catch (err) {
      toast.error("Failed to update team.");
      console.error(err);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="text-sm text-neutral-500 hover:text-black dark:hover:text-white underline">
            <IconDots size={24} />
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle className="text-center text-xl font-semibold text-neutral-800 dark:text-neutral-100">
            Edit Team
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-neutral-500">
            Update your team name or members
          </DialogDescription>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-200 mb-1 block">
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            {members.length > 0 && (
              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-200 mb-1 block">
                  Current Members
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {allUsers
                    .filter((user) => members.includes(user.user_id))
                    .sort((a, b) =>
                      a.user_id === currentUser.user_id
                        ? -1
                        : b.user_id === currentUser.user_id
                        ? 1
                        : 0
                    )
                    .map((user) => (
                      <div
                        key={user.user_id}
                        className="flex items-center gap-2 px-3 py-1 bg-neutral-200 dark:bg-neutral-800 rounded-full text-sm"
                      >
                        <span>{user.username}</span>
                        {user.user_id !== currentUser.user_id && (
                          <button
                            type="button"
                            onClick={() => setConfirmRemove(user)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <IconX size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-200 mb-1 block">
                Search Users
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by username..."
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
                Update Team
              </button>
            </DialogFooter>
          </form>

          <DialogClose className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600">
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Removing Member */}
      <Dialog
        open={!!confirmRemove}
        onOpenChange={() => setConfirmRemove(null)}
      >
        <DialogContent>
          <DialogTitle className="text-center text-lg font-semibold text-neutral-800 dark:text-neutral-100">
            Remove Member
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-neutral-500">
            Are you sure you want to remove{" "}
            <strong>{confirmRemove?.username}</strong> from this team?
          </DialogDescription>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setConfirmRemove(null)}
              className="rounded-full px-4 py-2 text-sm bg-neutral-300 dark:bg-neutral-700 text-black dark:text-white hover:opacity-80"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!confirmRemove) return;
                try {
                  await removeTeamMember({
                    teamId: team.team_id,
                    memberId: confirmRemove.user_id,
                  });
                  setMembers((prev) =>
                    prev.filter((id) => id !== confirmRemove.user_id)
                  );
                  toast.success(`${confirmRemove.username} removed from team`);
                  onTeamUpdated?.();
                } catch (error) {
                  toast.error("Failed to remove member");
                  console.error(error);
                } finally {
                  setConfirmRemove(null);
                }
              }}
              className="rounded-full px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600"
            >
              Remove
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EditTeamDialog;
