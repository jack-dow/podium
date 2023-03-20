import { z } from "zod";

export const Id = z.string().cuid2();
export const CreatedAt = z.date();
export const UpdatedAt = z.date();
