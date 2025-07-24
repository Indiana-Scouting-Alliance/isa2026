import type { AppRouter } from "@isa2026/api/src/router.ts";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
