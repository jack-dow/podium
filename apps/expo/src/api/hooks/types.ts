/* eslint-disable @typescript-eslint/no-explicit-any */
import { type UseQueryResult } from "@tanstack/react-query";

export type QueryOutput<QueryFn extends (...args: any) => UseQueryResult<unknown>> = NonNullable<
  ReturnType<QueryFn>["data"]
>;

export type ExtractMapEntryType<MapRecord extends Map<any, any>> = MapRecord extends Map<any, infer I> ? I : never;
