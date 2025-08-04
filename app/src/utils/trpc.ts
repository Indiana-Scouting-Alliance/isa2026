import type { AppRouter } from "@isa2026/api/src/router.ts";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_SERVER_URL + "/api",
      headers() {
        return {
          Authorization: "Bearer " + localStorage.getItem("token"),
        };
      },
    }),
  ],
});
