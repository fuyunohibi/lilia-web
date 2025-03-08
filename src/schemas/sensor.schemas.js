import { z } from "zod";

export const sensorSchema = z.object({
  sensor_name: z.string().min(1, { message: "Sensor name is required" }),
  sensor_type: z.string().min(1, { message: "Sensor type is required" }),
  sensor_unit: z.string().min(1, { message: "Sensor unit is required" }),
});
