import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";

import { appRouter } from "./api/router";
import { createTRPCContext } from "./api/trpc";

const app = express();

const ENDPOINT = "/api/trpc";

app.use(
  ENDPOINT,
  createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
    onError: console.log,
  }),
);

const PORT = 19001;
app.listen(PORT, () =>
  console.log("[expo-trpc] up and running on", `localhost:${PORT}${ENDPOINT}`),
);
