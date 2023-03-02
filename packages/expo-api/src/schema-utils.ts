import { z } from "zod";

export const Id = z.string().uuid();
export const CreatedAt = z.date();
export const UpdatedAt = z.date();
