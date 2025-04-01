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
import Dashboard from "@/components/ui/dashboard";
import Image from "next/image";
import { getPlants } from "@/actions/plants/plants.actions";


interface Team {
  team_id: string;
  team_name: string;
}

interface Garden {
  garden_id: string;
  garden_name: string;
  is_default: boolean;
}

interface Plant {
  plant_id: string;
  plant_name: string;
  plant_image_url: string;
}

const HomePage = () => {
  const router = useRouter();

  const [teams, setTeams] = useState<Team[]>([]);
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);

  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedGarden, setSelectedGarden] = useState<string>("");

  useEffect(() => {
    const initializeDefaults = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      const { data: teamList } = await getCurrentUserTeams(user.id);
      setTeams(teamList || []);

      if (user.default_team_id) {
        setSelectedTeam(user.default_team_id);

        const { data: gardensData } = await getTeamGardens(
          user.default_team_id
        );
        setGardens(gardensData || []);

        const defaultGarden = gardensData?.find(
          (garden: Garden) => garden.is_default
        );
        if (defaultGarden) {
          setSelectedGarden(defaultGarden.garden_id);
        }
      }
    };

    initializeDefaults();
  }, []);

  useEffect(() => {
    const loadGardens = async () => {
      if (!selectedTeam) return;

      const { data: gardensData } = await getTeamGardens(selectedTeam);
      setGardens(gardensData || []);

      const defaultGarden = gardensData?.find(
        (garden: Garden) => garden.is_default
      );
      setSelectedGarden(defaultGarden?.garden_id || "");
    };

    loadGardens();
  }, [selectedTeam]);

  useEffect(() => {
    const loadPlants = async () => {
      if (!selectedGarden) return;
      const { data } = await getPlants(selectedGarden);
      setPlants(data || []);
    };

    loadPlants();
  }, [selectedGarden]);

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="w-full md:w-64">
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
            <SelectTrigger className="w-full">
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

        {selectedTeam && (
          <div className="w-full md:w-64">
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
              <SelectTrigger className="w-full">
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

        {selectedGarden && (
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={() => router.push(`/gardens/${selectedGarden}/live`)}
              className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium shadow transition"
            >
              🎥 View Live Cam
            </button>

            <button
              onClick={() =>
                router.push(`/gardens/${selectedGarden}/watering-schedule`)
              }
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium shadow transition"
            >
              💧 See Watering Schedule
            </button>
          </div>
        )}
      </div>

      {selectedGarden && !["no-garden", "no-team"].includes(selectedGarden) && (
        <>
          <div>
            <h2 className="text-xl font-semibold mb-4">
              🌱 Plants in this Garden
            </h2>
            {plants.length === 0 ? (
              <p className="text-neutral-500 italic">
                No plants found in this garden.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {plants.map((plant) => (
                  <div
                    key={plant.plant_id}
                    className="rounded-2xl bg-white/60 dark:bg-neutral-800/40 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    {plant.plant_image_url && (
                      <div className="relative w-full aspect-[4/3] rounded-t-2xl overflow-hidden">
                        <Image
                          src={plant.plant_image_url}
                          alt={plant.plant_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="px-3 py-2">
                      <h3 className="text-sm font-semibold text-neutral-800 dark:text-white truncate">
                        {plant.plant_name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Dashboard />
        </>
      )}
    </PageWrapper>
  );
};

export default HomePage;
