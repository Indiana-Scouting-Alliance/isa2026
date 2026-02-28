import { D1PreparedStatement } from "@cloudflare/workers-types";
import { z } from "zod";
import { loggedPublicProcedure } from "../trpc.ts";
import {
  TeamMatchEntryColumns,
  TeamMatchEntrySchema,
} from "../utils/dbtypes.ts";

export const putEntries = loggedPublicProcedure
  .input(z.array(z.union([TeamMatchEntrySchema])))
  .mutation(async (opts) => {
    console.log(opts.input);
    const boundStmts: D1PreparedStatement[] = [];

    const teamMatchEntryStmt = opts.ctx.env.DB.prepare(
      `REPLACE INTO
        TeamMatchEntry(
          ${TeamMatchEntryColumns.join(", ")}
        )
      VALUES
        (${new Array(TeamMatchEntryColumns.length).fill("?").join(",")});`
    );
    const matchKeys = new Set();

    for (let match of opts.input) {
      if (match.matchLevel === "Qualification") {
        matchKeys.add(
          ((
            [
              "2025archimedes",
              "2025curie",
              "2025daly",
              "2025galileo",
              "2025hopper",
              "2025johnson",
              "2025milstein",
              "2025newton",
              "2025inind",
            ].includes(match.eventKey)
          ) ?
            {
              "2025archimedes": "2025arc",
              "2025curie": "2025cur",
              "2025daly": "2025dal",
              "2025galileo": "2025gal",
              "2025hopper": "2025hop",
              "2025johnson": "2025joh",
              "2025milstein": "2025mil",
              "2025newton": "2025new",
              "2025inind": "2025iri",
            }[match.eventKey]
          : match.eventKey) +
            "_qm" +
            match.matchNumber
        );
      } else {
        //TODO
      }
      
        boundStmts.push(
          teamMatchEntryStmt.bind(
            ...TeamMatchEntryColumns.map((column) => match[column])
          )
        );
    }

    await opts.ctx.env.DB.batch(boundStmts);
    console.log(matchKeys);

   
    const boundTbaStmts: D1PreparedStatement[] = [];
    if (boundTbaStmts.length > 0) {
      await opts.ctx.env.DB.batch(boundTbaStmts);
    }
  });
