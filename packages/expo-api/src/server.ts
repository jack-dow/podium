/* eslint-disable @typescript-eslint/no-floating-promises */
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";

import { createTRPCContext } from "./context";
import { appRouter } from "./router";

const server = fastify({
  logger: true,
  maxParamLength: 5000,
});

server.register(fastifyTRPCPlugin, {
  prefix: "/api/trpc",
  trpcOptions: { router: appRouter, createContext: createTRPCContext },
});
(async () => {
  try {
    await server.listen({ port: 19001 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
