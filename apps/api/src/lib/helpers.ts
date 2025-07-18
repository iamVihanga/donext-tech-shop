import { z } from "zod";

export const errorMessageSchema = z.object({
  message: z.string()
});

export const stringIdParamSchema = z.object({
  id: z.string()
});

export const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional()
});

export type QueryParamsSchema = z.infer<typeof queryParamsSchema>;

export function getPaginatedSchema<T>(data: z.ZodType<T>) {
  return z.object({
    data,
    meta: z.object({
      currentPage: z.number(),
      limit: z.number(),
      totalCount: z.number(),
      totalPages: z.number()
    })
  });
}

export function toKebabCase(str: string) {
  return (
    str
      // Add hyphen before capital letters and convert to lowercase
      .replace(/([A-Z])/g, "-$1")
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, "-")
      // Remove any non-alphanumeric characters (except hyphens)
      .replace(/[^\w\s-]/g, "")
      // Convert to lowercase
      .toLowerCase()
      // Remove leading hyphen if present
      .replace(/^-/, "")
      // Replace multiple consecutive hyphens with a single one
      .replace(/-+/g, "-")
  );
}
