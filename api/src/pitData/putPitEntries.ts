import { D1PreparedStatement } from "@cloudflare/workers-types";
import { z } from "zod";
import { loggedPublicProcedure } from "../trpc.ts";
import {
    PitScoutEntryColumns,
    PitScoutEntrySchema,
} from "../utils/dbtypes.ts";

export const putPitEntries = loggedPublicProcedure
  .input(z.array(PitScoutEntrySchema))
  .mutation(async (opts) => {
    console.log(opts.input);
    const boundStmts: D1PreparedStatement[] = [];

    const pitEntryStmt = opts.ctx.env.DB.prepare(
      `REPLACE INTO
        PitScoutEntry(
          ${PitScoutEntryColumns.join(", ")}
        )
      VALUES
        (${new Array(PitScoutEntryColumns.length).fill("?").join(",")});`
    );

    for (const entry of opts.input) {
      boundStmts.push(
        pitEntryStmt.bind(
          ...PitScoutEntryColumns.map((column) => entry[column])
        )
      );
    }

    await opts.ctx.env.DB.batch(boundStmts);
  });
