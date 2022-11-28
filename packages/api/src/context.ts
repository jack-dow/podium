import { prisma } from '@podium/db';
import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
interface CreateContextOptions {}

/** Use this helper for:
 *  - testing, where we don't have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 */
export async function createContextInner(opts: CreateContextOptions) {
  return {
    prisma,
  };
}

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export async function createContext(opts: CreateNextContextOptions) {
  return await createContextInner({});
}
export type Context = inferAsyncReturnType<typeof createContextInner>;
