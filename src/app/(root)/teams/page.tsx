"use client";

import { useEffect, useState } from "react";
import {
  getCurrentUserTeams,
  getTeamMembers,
  getTeamGardens,
} from "@/actions/teams/teams.actions";
import { getCurrentUser } from "@/actions/users/users.actions";
import { IconUsersGroup, IconChevronDown } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import PageWrapper from "@/components/layout.tsx/page-content";
import { UserTooltip } from "@/components/ui/user-tooltip";
import AddTeamDialog from "@/components/teams/add-team-dialog";

const TeamPage = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<{ [key: string]: any[] }>({});
  const [teamGardens, setTeamGardens] = useState<{ [key: string]: any[] }>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadTeamsAndMembers = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    setCurrentUser(user);

    const { data, error } = await getCurrentUserTeams(user.id);
    if (!error && data) {
      setTeams(data);

      const memberPromises = data.map((team: any) =>
        getTeamMembers(team.team_id)
      );

      const memberResults = await Promise.all(memberPromises);

      const membersByTeam: { [key: string]: any[] } = {};
      data.forEach((team: any, idx: number) => {
        membersByTeam[team.team_id] = memberResults[idx]?.data ?? [];
      });

      setTeamMembers(membersByTeam);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadTeamsAndMembers();
  }, []);

  const toggleExpand = async (teamId: string) => {
    if (expandedTeam === teamId) {
      setExpandedTeam(null);
      return;
    }

    if (!teamGardens[teamId]) {
      const { data: gardens } = await getTeamGardens(teamId);
      setTeamGardens((prev) => ({ ...prev, [teamId]: gardens ?? [] }));
    }

    setExpandedTeam(teamId);
  };

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
          My Teams
        </h1>

        {currentUser && <AddTeamDialog currentUser={currentUser} />}
      </motion.div>

      {loading ? (
        <div className="flex flex-col gap-4 w-full">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="h-24 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-neutral-800"
            />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-neutral-500 dark:text-neutral-400 text-center mt-10">
          You’re not part of any team yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {teams.map((team) => {
            const isExpanded = expandedTeam === team.team_id;
            const members = teamMembers[team.team_id] ?? [];
            const gardens = teamGardens[team.team_id] ?? [];

            return (
              <div key={team.team_id} className="relative group">
                <div
                  className={cn(
                    "rounded-2xl h-[300px] w-full border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 transition hover:shadow-md flex flex-col justify-between"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                        <IconUsersGroup className="h-6 w-6 text-black dark:text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-neutral-800 dark:text-white">
                          {team.team_name}
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {members.length} member
                          {members.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex">
                      <UserTooltip
                        items={
                          members.map((member: any, idx: number) => ({
                            id: idx,
                            name: member.username,
                            designation: "Member",
                            image: member.avatar_url,
                          })) ?? []
                        }
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(team.team_id)}
                    className="group flex items-center justify-between mt-6 text-sm text-neutral-700 dark:text-neutral-300 hover:underline w-full"
                  >
                    <span>View Details</span>
                    <IconChevronDown
                      className={cn(
                        "h-5 w-5 transform transition-transform duration-200",
                        isExpanded ? "rotate-180" : "rotate-0"
                      )}
                    />
                  </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      key="expand"
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className={cn(
                        "absolute left-0 top-full mt-2 z-10 w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
                      )}
                    >
                      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
                        Gardens
                      </p>
                      {gardens.length === 0 ? (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
                          This team has no gardens yet.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {gardens.map((g: any, idx: number) => (
                            <div
                              key={g.garden_id ?? idx}
                              className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 bg-neutral-50 dark:bg-neutral-900"
                            >
                              <h3 className="text-sm font-semibold text-neutral-800 dark:text-white">
                                {g.garden_name}
                              </h3>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {g.garden_location}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
};

export default TeamPage;
