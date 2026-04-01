import { D1PreparedStatement } from "@cloudflare/workers-types";
import { Env } from "../index.ts";

type TbaAllianceBreakdown = Record<string, number | boolean | string | null>;
type TbaHubScoreBreakdown = {
  autoCount?: number | null;
  teleopCount?: number | null;
};
type TbaMatch = {
  comp_level: "qm" | "ef" | "qf" | "sf" | "f";
  match_number: number;
  score_breakdown?: {
    red?: TbaAllianceBreakdown | null;
    blue?: TbaAllianceBreakdown | null;
  } | null;
};


const toTbaEventKey = (eventKey: string) => eventKey.toLowerCase();

const asNumber = (value: unknown) => (typeof value === "number" ? value : null);

const getFuelFromBreakdown = (
  breakdown: TbaAllianceBreakdown | null | undefined
): { auto: number | null; tele: number | null } => {
  if (!breakdown) {
    return { auto: null, tele: null };
  }
  const hubScore = breakdown.hubScore as TbaHubScoreBreakdown | undefined;

  return {
    auto: asNumber(hubScore?.autoCount) ?? 0,
    tele: asNumber(hubScore?.teleopCount) ?? 0
  };
};

const calculateFuelForTeamMatchEntries = async (env: Env, eventKey: string) => {
  if (
    eventKey.startsWith("2024") ||
    eventKey.startsWith("2025") ||
    eventKey.toLowerCase() === "2026inmis"
  ) {
    return;
  }

  // Recalculate robot fuel estimates.
  await env.DB.prepare(
    `UPDATE TeamMatchEntry
      SET autoFuelScored = CAST(
            ROUND((totalAllianceFuelScoredOfficialAuto * autoFuelScoredPercentage) / 100.0)
            AS INTEGER
          ),
          teleFuelScored = CAST(
            ROUND((totalAllianceFuelScoredOfficialTele * teleFuelScoredPercentage) / 100.0)
            AS INTEGER
          ),
          flag = 'finalized'
      WHERE eventKey = ?
        AND matchLevel = 'Qualification'
        AND flag = 'officialized'
        AND totalAllianceFuelScoredOfficialAuto IS NOT NULL
        AND totalAllianceFuelScoredOfficialTele IS NOT NULL
        AND autoFuelScoredPercentage IS NOT NULL
        AND teleFuelScoredPercentage IS NOT NULL;`
  ).bind(eventKey).run();
};

const pullAndFillEvent = async (env: Env, eventKey: string) => {
  const tbaEventKey = toTbaEventKey(eventKey);
  if(tbaEventKey.startsWith("2024") || tbaEventKey.startsWith("2025")) {
    return;
  }


  const matchesRes = await fetch(
    `https://www.thebluealliance.com/api/v3/event/${tbaEventKey}/matches`,
    {
      method: "GET",
      headers:{
            "X-TBA-Auth-Key": env.TBA_API_TOKEN,
          },
    }
  );

  if (matchesRes.status !== 200) {
    console.log(
      `TBA pull failed for ${eventKey} (${tbaEventKey}): ${matchesRes.status} ${matchesRes.statusText}`
    );
    return;
  }


  const matches = (await matchesRes.json()) as TbaMatch[];
  const boundStmts: D1PreparedStatement[] = [];


  for (const match of matches) {
    if (match.comp_level !== "qm" || !match.score_breakdown) {
      continue;
    }

    const redFuel = getFuelFromBreakdown(match.score_breakdown.red);
    const blueFuel = getFuelFromBreakdown(match.score_breakdown.blue);
    if (redFuel.auto !== null || redFuel.tele !== null) {
      boundStmts.push(
        env.DB.prepare(
          `UPDATE TeamMatchEntry
            SET totalAllianceFuelScoredOfficialAuto = COALESCE(totalAllianceFuelScoredOfficialAuto, ?),
                totalAllianceFuelScoredOfficialTele = COALESCE(totalAllianceFuelScoredOfficialTele, ?),
                flag = ?
            WHERE eventKey = ?
              AND matchLevel = 'Qualification'
              AND matchNumber = ?
              AND alliance = 'Red'
              AND (
                totalAllianceFuelScoredOfficialAuto IS NULL
                OR totalAllianceFuelScoredOfficialTele IS NULL
              );`
        ).bind(redFuel.auto, redFuel.tele, "officialized", eventKey, match.match_number)
      );
    }

    if (blueFuel.auto !== null || blueFuel.tele !== null) {
      boundStmts.push(
        env.DB.prepare(
          `UPDATE TeamMatchEntry
            SET totalAllianceFuelScoredOfficialAuto = COALESCE(totalAllianceFuelScoredOfficialAuto, ?),
                totalAllianceFuelScoredOfficialTele = COALESCE(totalAllianceFuelScoredOfficialTele, ?),
                flag = ?
            WHERE eventKey = ?
              AND matchLevel = 'Qualification'
              AND matchNumber = ?
              AND alliance = 'Blue'
              AND (
                totalAllianceFuelScoredOfficialAuto IS NULL
                OR totalAllianceFuelScoredOfficialTele IS NULL
              );`
        ).bind(blueFuel.auto, blueFuel.tele, "officialized", eventKey, match.match_number)
      );
    }
  }

  if (boundStmts.length > 0) {
    await env.DB.batch(boundStmts);
  }

  await calculateFuelForTeamMatchEntries(env, eventKey);
};

export const fillOfficialFuelFromTba = async (env: Env) => {
  const eventsToFill = await env.DB.prepare(
    `SELECT DISTINCT eventKey
      FROM TeamMatchEntry
      WHERE matchLevel = 'Qualification'
        AND (
          totalAllianceFuelScoredOfficialAuto IS NULL
          OR totalAllianceFuelScoredOfficialTele IS NULL
        )
      LIMIT 25;`
  ).all<{ eventKey: string }>();

  if (!eventsToFill.success || eventsToFill.results.length === 0) {
    return;
  }

  for (const { eventKey } of eventsToFill.results) {
    await pullAndFillEvent(env, eventKey);
    await calculateFuelForTeamMatchEntries(env, eventKey);
    console.log(`Finished TBA pull for ${eventKey}`);
  }
};
