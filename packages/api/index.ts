import * as dotenv from 'dotenv';
dotenv.config();

export type { AppRouter } from './src/router';
export { appRouter } from './src/router';

export { createContext } from './src/context';
export type { Context } from './src/context';
