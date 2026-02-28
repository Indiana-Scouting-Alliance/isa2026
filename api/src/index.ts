import { D1Database, KVNamespace } from "@cloudflare/workers-types";
import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from "@trpc/server/adapters/fetch";
import { createContext } from "./context.ts";
//import { hooksRouter } from "./hooks/index.ts";
import { createPublicContext } from "./public/context.ts";
import { publicRouter } from "./public/index.ts";
import { appRouter } from "./router.ts";

export interface Env {
  DB: D1Database;
  KV: KVNamespace;

  ADMIN_ACCOUNT_USERNAME: string;
  ADMIN_ACCOUNT_PASSWORD: string;

  JWT_PRIVATE_KEY: string;

  FIRST_API_TOKEN: string;
  TBA_API_TOKEN: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      const response = new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*, Authorization",
        },
      });
      return response;
    }

    const url = new URL(request.url);
    if (url.pathname.startsWith("/public")) {
      return await createPublicContext(
        request,
        url.pathname.split("/").filter((x) => x !== "" && x !== "public"),
        url.searchParams,
        env,
        publicRouter
      );
    }
/****
    if (url.pathname.startsWith("/hooks")) {
      return await createWebhooksContext(
        request,
        url.pathname.split("/").filter((x) => x !== "" && x !== "hooks"),
        env,
        hooksRouter
      );
    }
****/
    return fetchRequestHandler({
      endpoint: "/api",
      req: request,
      router: appRouter,
      createContext: (options: FetchCreateContextFnOptions) =>
        createContext({
          ...options,
          env,
        }),
    });
  },
  /****
   async scheduled(event: ScheduledEvent, env: Env) {
    try {
      // Query for records with null flag
      const records = await env.DB.prepare(
        `SELECT * FROM TeamMatchEntry WHERE flag IS "";`
      ).all();
      
      console.log(`Found ${records.results.length} records with blank flag`);
      
      for (const record of records.results) {
        console.log(record.noShow);
        if(record.noShow == 1) {
          return
        }
        const matchData = await getTBAMatchData((record.eventKey as string).toLowerCase(), env);
        console.log(`Fetched match data for ${record.matchKey} from TBA`);
        console.log(matchData);
        
      }
    } catch (error) {
      console.error('Cron job failed:', error);
    }
  }

};

async function getTBAMatchData(matchKey: string, env: Env): Promise<JSON> {
  const matchRes = await fetch(
    "https://www.thebluealliance.com/api/v3/match/" + matchKey,
    {
      method: "GET",
      headers: {
        
        "X-TBA-Auth-Key": env.TBA_API_TOKEN,
      },
    }
  );
  if (matchRes.status === 200) {
    const matchBody: JSON = await matchRes.json();
    return matchBody;
  } else {
    throw new Error("Failed to fetch match data from TBA");
  }
  ****/
}
