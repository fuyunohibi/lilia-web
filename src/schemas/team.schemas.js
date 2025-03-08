import { z } from "zod";

export const teamSchema = z.object({
  teamName: z.string().min(1, { message: "Team Name is required" }),
  members: z.array(z.string().uuid({ message: "Invalid user ID" })).min(1, {
    message: "At least one member is required",
  }),
});
