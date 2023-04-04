import { exerciseRouter } from "./routers/exercise";
import { templateRouter } from "./routers/template";
import { templateExerciseRouter } from "./routers/templateExercise";
import { templateSetRouter } from "./routers/templateSet";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  exercise: exerciseRouter,
  template: templateRouter,
  templateExercise: templateExerciseRouter,
  templateSet: templateSetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
