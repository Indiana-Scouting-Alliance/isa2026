import { D1PreparedStatement } from "@cloudflare/workers-types";
import { z } from "zod";
import { TbaMatch } from "../hooks/tba.ts";
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

    const updateTeamMatchEntry = opts.ctx.env.DB.prepare(
      `UPDATE TeamMatchEntry
        SET tbaAutoLine = ?,
          tbaEndgamePark = ?,
          tbaEndgameShallow = ?,
          tbaEndgameDeep = ?
        WHERE eventKey = ?
          AND matchLevel = ?
          AND matchNumber = ?
          AND alliance = ?
          AND robotNumber = ?;`
    );
   
    const boundTbaStmts: D1PreparedStatement[] = [];

    for (const key of matchKeys) {
      const matchRes = await fetch(
        "https://www.thebluealliance.com/api/v3/match/" + key,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": opts.ctx.env.TBA_API_TOKEN,
          },
        }
      );
      if (matchRes.status === 200) {
        const matchBody: TbaMatch = await matchRes.json();
        console.log(matchBody);

        if (matchBody.score_breakdown?.red.autoLineRobot1) {
          boundTbaStmts.push(
            updateTeamMatchEntry.bind(
              matchBody.score_breakdown.red.autoLineRobot1 === "Yes",
              matchBody.score_breakdown.red.endGameRobot1 === "Parked",
              matchBody.score_breakdown.red.endGameRobot1 === "ShallowCage",
              matchBody.score_breakdown.red.endGameRobot1 === "DeepCage",
              matchBody.event_key,
              {
                qm: "Qualification",
                ef: "Playoff",
                qf: "Playoff",
                sf: "Playoff",
                f: "Playoff",
              }[matchBody.comp_level],
              matchBody.match_number,
              "Red",
              1
            )
          );
          boundTbaStmts.push(
            updateTeamMatchEntry.bind(
              matchBody.score_breakdown.red.autoLineRobot2 === "Yes",
              matchBody.score_breakdown.red.endGameRobot2 === "Parked",
              matchBody.score_breakdown.red.endGameRobot2 === "ShallowCage",
              matchBody.score_breakdown.red.endGameRobot2 === "DeepCage",
              matchBody.event_key,
              {
                qm: "Qualification",
                ef: "Playoff",
                qf: "Playoff",
                sf: "Playoff",
                f: "Playoff",
              }[matchBody.comp_level],
              matchBody.match_number,
              "Red",
              2
            )
          );
          boundTbaStmts.push(
            updateTeamMatchEntry.bind(
              matchBody.score_breakdown.red.autoLineRobot3 === "Yes",
              matchBody.score_breakdown.red.endGameRobot3 === "Parked",
              matchBody.score_breakdown.red.endGameRobot3 === "ShallowCage",
              matchBody.score_breakdown.red.endGameRobot3 === "DeepCage",
              matchBody.event_key,
              {
                qm: "Qualification",
                ef: "Playoff",
                qf: "Playoff",
                sf: "Playoff",
                f: "Playoff",
              }[matchBody.comp_level],
              matchBody.match_number,
              "Red",
              3
            )
          );
          boundTbaStmts.push(
            updateTeamMatchEntry.bind(
              matchBody.score_breakdown.blue.autoLineRobot1 === "Yes",
              matchBody.score_breakdown.blue.endGameRobot1 === "Parked",
              matchBody.score_breakdown.blue.endGameRobot1 === "ShallowCage",
              matchBody.score_breakdown.blue.endGameRobot1 === "DeepCage",
              matchBody.event_key,
              {
                qm: "Qualification",
                ef: "Playoff",
                qf: "Playoff",
                sf: "Playoff",
                f: "Playoff",
              }[matchBody.comp_level],
              matchBody.match_number,
              "Blue",
              1
            )
          );
          boundTbaStmts.push(
            updateTeamMatchEntry.bind(
              matchBody.score_breakdown.blue.autoLineRobot2 === "Yes",
              matchBody.score_breakdown.blue.endGameRobot2 === "Parked",
              matchBody.score_breakdown.blue.endGameRobot2 === "ShallowCage",
              matchBody.score_breakdown.blue.endGameRobot2 === "DeepCage",
              matchBody.event_key,
              {
                qm: "Qualification",
                ef: "Playoff",
                qf: "Playoff",
                sf: "Playoff",
                f: "Playoff",
              }[matchBody.comp_level],
              matchBody.match_number,
              "Blue",
              2
            )
          );
          boundTbaStmts.push(
            updateTeamMatchEntry.bind(
              matchBody.score_breakdown.blue.autoLineRobot3 === "Yes",
              matchBody.score_breakdown.blue.endGameRobot3 === "Parked",
              matchBody.score_breakdown.blue.endGameRobot3 === "ShallowCage",
              matchBody.score_breakdown.blue.endGameRobot3 === "DeepCage",
              matchBody.event_key,
              {
                qm: "Qualification",
                ef: "Playoff",
                qf: "Playoff",
                sf: "Playoff",
                f: "Playoff",
              }[matchBody.comp_level],
              matchBody.match_number,
              "Blue",
              3
            )
          );

        }
      }
    }
    if (boundTbaStmts.length > 0) {
      await opts.ctx.env.DB.batch(boundTbaStmts);
    }
  });
