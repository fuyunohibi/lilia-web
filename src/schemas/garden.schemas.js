import { z } from "zod";

export const gardenSchema = z.object({
  team_id: z.string().uuid({ message: "Team ID is required" }),
  garden_name: z.string().min(1, { message: "Garden name is required" }),
  garden_location: z
    .string()
    .min(1, { message: "Garden location is required" }),
});
