"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout.tsx/page-content";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getCurrentUser } from "@/actions/users/users.actions";
import {
  getCurrentUserTeams,
  getTeamGardens,
} from "@/actions/teams/teams.actions";
import { getGardenPlants } from "@/actions/gardens/gardens.actions";

const HomePage = () => {
  const router = useRouter();

  const [teams, setTeams] = useState<any[]>([]);
  const [gardens, setGardens] = useState<any[]>([]);
  const [plants, setPlants] = useState<any[]>([]);

  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedGarden, setSelectedGarden] = useState<string>("");

  useEffect(() => {
    const loadTeams = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      const { data } = await getCurrentUserTeams(user.id);
      setTeams(data || []);
    };

    loadTeams();
  }, []);

  useEffect(() => {
    const loadGardens = async () => {
      if (!selectedTeam) return;

      const { data } = await getTeamGardens(selectedTeam);
      setGardens(data || []);
      setSelectedGarden(""); // Reset garden on team change
    };

    loadGardens();
  }, [selectedTeam]);

  useEffect(() => {
    const loadPlants = async () => {
      if (!selectedGarden) return;
      const { data } = await getGardenPlants(selectedGarden);
      setPlants(data || []);
    };

    loadPlants();
  }, [selectedGarden]);

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Select Team */}
        <div>
          <label className="mb-1 block text-sm font-medium">Select Team</label>
          <Select
            value={selectedTeam}
            onValueChange={(value) => {
              if (value === "no-team") {
                router.push("/teams");
              } else {
                setSelectedTeam(value);
              }
            }}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Choose a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.length > 0 ? (
                teams.map((team) => (
                  <SelectItem key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-team" className="text-neutral-500">
                  ➕ No team? Click here to create one
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Select Garden */}
        {selectedTeam && (
          <div>
            <label className="mb-1 block text-sm font-medium">
              Select Garden
            </label>
            <Select
              value={selectedGarden}
              onValueChange={(value) => {
                if (value === "no-garden") {
                  router.push("/gardens");
                } else {
                  setSelectedGarden(value);
                }
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Choose a garden" />
              </SelectTrigger>
              <SelectContent>
                {gardens.length > 0 ? (
                  gardens.map((garden) => (
                    <SelectItem key={garden.garden_id} value={garden.garden_id}>
                      {garden.garden_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-garden" className="text-neutral-500">
                    ➕ No gardens? Add one
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Plants in Selected Garden */}
      {selectedGarden && !["no-garden", "no-team"].includes(selectedGarden) && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            🌱 Plants in this Garden
          </h2>
          {plants.length === 0 ? (
            <p className="text-neutral-500 italic">
              No plants found in this garden.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {plants.map((plant) => (
                <div
                  key={plant.plant_id}
                  className="rounded-xl border p-4 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                >
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-white">
                    {plant.plant_name}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {plant.plant_species}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default HomePage;
