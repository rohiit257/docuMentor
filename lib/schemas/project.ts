import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(50, "Project name is too long"),
  domain: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  is_deployed: z.boolean().default(false),
});

export type ProjectFormData = z.infer<typeof projectSchema>; 