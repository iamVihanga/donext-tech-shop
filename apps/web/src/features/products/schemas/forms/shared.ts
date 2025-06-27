import { z } from "zod";

export const formStepStatus = z.enum(["pending", "valid", "invalid"]);

export type FormStepStatusT = z.infer<typeof formStepStatus>;
