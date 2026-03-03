import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authedLoggedProcedure } from "../trpc.ts";
import {
    PitScoutEntry,
    PitScoutEntryColumn,
    PitScoutEntryColumns,
} from "../utils/dbtypes.ts";

export const pitData = authedLoggedProcedure
  .input(
    z.object({
      events: z.array(z.string()).nonempty().optional(),
      teams: z.array(z.number().positive()).nonempty().optional(),
    })
  )
  .query(async (opts) => {
    if (
      opts.ctx.user.permLevel !== "demo" &&
      opts.ctx.user.permLevel !== "team" &&
      opts.ctx.user.permLevel !== "datamanage" &&
      opts.ctx.user.permLevel !== "admin"
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Wrong permissions to fetch pit data.",
      });
    }

    const columns: PitScoutEntryColumn[] = [...PitScoutEntryColumns];

    let query = `SELECT ${columns.join(", ")}
                FROM PitScoutEntry
                WHERE (`;
    const bindParams: string[] = [];

    if (opts.input.events) {
      query += opts.input.events
        .map((value) => {
          bindParams.push(value);
          return "eventKey = ?";
        })
        .join(" OR ");
    } else {
      query += "1";
    }
    query += ") AND (";

    if (opts.input.teams) {
      query += opts.input.teams
        .map((value) => {
          bindParams.push(value.toString());
          return "teamNumber = ?";
        })
        .join(" OR ");
    } else {
      query += "1";
    }
    query += ")";

    const results = await opts.ctx.env.DB.prepare(query)
      .bind(...bindParams)
      .all<PitScoutEntry>();

    if (results.success) {
      return results.results;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error while fetching pit data.",
    });
  });
