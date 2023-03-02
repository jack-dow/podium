import { type CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import { prisma } from "./prisma";

type CreateContextOptions = {
  // session: Session | null
};

/**
 * Inner function for `createTRPCContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */

const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {
    prisma,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (opts: CreateFastifyContextOptions) => {
  return createInnerTRPCContext(opts);
};
