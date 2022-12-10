import { z } from 'zod';

export const Id = z.string().uuid();
export const ObjectWithId = z.object({
  id: Id,
});
