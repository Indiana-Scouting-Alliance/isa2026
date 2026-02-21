import { z } from "zod";
import { no } from "zod/v4/locales";

export const Alliance = ["Red", "Blue"] as const;
export const MatchLevel = [
  "None",
  "Practice",
  "Qualification",
  "Playoff",
] as const;

export const CommonEntrySchema = z.object({
  eventKey: z.string(),
  matchLevel: z.union([
    z.literal("None"),
    z.literal("Practice"),
    z.literal("Qualification"),
    z.literal("Playoff"),
  ]),
  matchNumber: z.number().int().nonnegative(),
  teamNumber: z.number().int().nonnegative(),
  alliance: z.union([z.literal("Red"), z.literal("Blue")]),
  robotNumber: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
  ]),
  deviceTeamNumber: z.number().int().nonnegative(),
  deviceId: z.string(),
  scoutTeamNumber: z.number().int().nonnegative(),
  scoutName: z.string(),
  flag: z.string(),
});
export type CommonEntry = z.infer<typeof CommonEntrySchema>;
export type CommonEntryColumn = keyof CommonEntry;
export const CommonEntryColumns: CommonEntryColumn[] = [
  "eventKey",
  "matchLevel",
  "matchNumber",
  "teamNumber",
  "alliance",
  "robotNumber",
  "deviceTeamNumber",
  "deviceId",
  "scoutTeamNumber",
  "scoutName",
  "flag",
] as CommonEntryColumn[];

export const TeamMatchEntrySchema = CommonEntrySchema.omit({
  robotNumber: true,
}).extend({
  robotNumber: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  noShow: z.boolean(),
  comments: z.string().nullable(),
  startZone: z.union([
    z.literal("depot"),
    z.literal("mid"),
    z.literal("outpost"),
  ]).nullable(),
  autoFuelHubScoring: z.boolean().nullable(),
  autoFuelHubScoringLocation: z.union([
    z.literal("hub"),
    z.literal("tower"),
    z.literal("depot"),
    z.literal("outpost"),
    z.literal("trench"),
    z.literal("bump"),
    z.literal("other"),
  ]).nullable(),
  autoFuelPassed: z.boolean().nullable(),
  autoClimbPosition: z.union([
    z.literal("outpost"),
    z.literal("center"),
    z.literal("depot"),
    z.literal("other"),
  ]).nullable(),
  autoClimbAttempted: z.boolean().nullable(),
  autoClimbLevel: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
  ]).nullable(),
  autoFuelScored: z.number().int().nonnegative().nullable(),


  teleFuelScored: z.number().int().nonnegative().nullable(),
  teleCycles: z.number().int().nonnegative().nullable(),
  teleFuelScoredFromHub: z.boolean().nullable(),
  teleFuelScoredFromTower: z.boolean().nullable(),
  teleFuelScoredFromDepot: z.boolean().nullable(),
  teleFuelScoredFromOutpost: z.boolean().nullable(),
  teleFuelScoredFromTrench: z.boolean().nullable(),
  teleFuelScoredFromBump: z.boolean().nullable(),
  teleFuelScoredFromOther: z.boolean().nullable(),

  teleInactiveDefenseRoleEffectiveness: z.number().int().min(0).max(10).nullable(),
  teleInactiveIntakingRoleEffectiveness: z.number().int().min(0).max(10).nullable(),
  teleInactiveFeedingRoleEffectiveness: z.number().int().min(0).max(10).nullable(),
  teleInactiveFuelPassed: z.number().int().nonnegative().nullable(),
  


  endClimbAttempted: z.boolean().nullable(),
  robotGotStuck: z.boolean().nullable(),
  robotTraverseTrench: z.boolean().nullable(),
  robotTraverseBump: z.boolean().nullable(),
  died: z.boolean().nullable(),
  dataConfidence: z.number().int().min(0).max(10).nullable(),
});
export type TeamMatchEntry = z.infer<typeof TeamMatchEntrySchema>;
export type TeamMatchEntryColumn = keyof TeamMatchEntry;
export const TeamMatchEntryColumns: TeamMatchEntryColumn[] = [
  ...CommonEntryColumns,

  "noShow",
  "comments",
  "startZone",
  "autoFuelHubScoring",
  "autoFuelHubScoringLocation",
  "autoFuelPassed",
  "autoClimbPosition",
  "autoClimbAttempted",
  "autoClimbLevel",
  "autoFuelScored",
  "teleFuelScored",
  "teleCycles",
  "teleFuelScoredFromHub",
  "teleFuelScoredFromTower",
  "teleFuelScoredFromDepot",
  "teleFuelScoredFromOutpost",
  "teleFuelScoredFromTrench",
  "teleFuelScoredFromBump",
  "teleFuelScoredFromOther",

  "teleInactiveDefenseRoleEffectiveness",
  "teleInactiveIntakingRoleEffectiveness",
  "teleInactiveFeedingRoleEffectiveness",
  "teleInactiveFuelPassed",

  "endClimbAttempted",
  "robotGotStuck",
  "robotTraverseTrench",
  "robotTraverseBump",
  "died",
  "dataConfidence"
] as TeamMatchEntryColumn[];
export const TeamMatchEntryInit: TeamMatchEntry = {
  eventKey: "",
  matchLevel: "Qualification",
  matchNumber: 1,
  teamNumber: 0,
  alliance: "Red",
  robotNumber: 1,
  deviceTeamNumber: 0,
  deviceId: "",
  scoutTeamNumber: 0,
  scoutName: "",
  flag: "",

  noShow: false,
  comments: null,
  startZone: null,
  autoFuelHubScoring: null,
  autoFuelHubScoringLocation: null,
  autoFuelPassed: null,
  autoClimbPosition: null,
  autoClimbAttempted: null,
  autoClimbLevel: null,
  autoFuelScored: null,
  teleFuelScored: null,
  teleCycles: null,
  teleFuelScoredFromHub: null,
  teleFuelScoredFromTower: null,
  teleFuelScoredFromDepot: null,
  teleFuelScoredFromOutpost: null,
  teleFuelScoredFromTrench: null,
  teleFuelScoredFromBump: null,
  teleFuelScoredFromOther: null,

  teleInactiveDefenseRoleEffectiveness: null,
  teleInactiveIntakingRoleEffectiveness: null,
  teleInactiveFeedingRoleEffectiveness: null,
  teleInactiveFuelPassed: null,

  endClimbAttempted: null,
  robotGotStuck: null,
  robotTraverseTrench: null,
  robotTraverseBump: null,
  died: null,
  dataConfidence: null,
};
export const TeamMatchEntryNoShowInit: TeamMatchEntry = {
  eventKey: "",
  matchLevel: "Qualification",
  matchNumber: 1,
  teamNumber: 0,
  alliance: "Red",
  robotNumber: 1,
  deviceTeamNumber: 0,
  deviceId: "",
  scoutTeamNumber: 0,
  scoutName: "",
  flag: "",

  noShow: true,
  comments: null,
  startZone: null,
  autoFuelHubScoring: null,
  autoFuelHubScoringLocation: null,
  autoFuelPassed: null,
  autoClimbPosition: null,
  autoClimbAttempted: null,
  autoClimbLevel: null,
  autoFuelScored: null,
  teleFuelScored: null,
  teleCycles: null,
  teleFuelScoredFromHub: null,
  teleFuelScoredFromTower: null,
  teleFuelScoredFromDepot: null,
  teleFuelScoredFromOutpost: null,
  teleFuelScoredFromTrench: null,
  teleFuelScoredFromBump: null,
  teleFuelScoredFromOther: null,

  teleInactiveDefenseRoleEffectiveness: null,
  teleInactiveIntakingRoleEffectiveness: null,
  teleInactiveFeedingRoleEffectiveness: null,
  teleInactiveFuelPassed: null,

  endClimbAttempted: null,
  robotGotStuck: null,
  robotTraverseTrench: null,
  robotTraverseBump: null,
  died: null,
  dataConfidence: null,
};



export const UserPermLevel = [
  "none",
  "demo",
  "team",
  "datamanage",
  "admin",
] as const;
export const UserSchema = z.object({
  username: z.string(),
  permLevel: z.union([
    z.literal("none"),
    z.literal("demo"),
    z.literal("team"),
    z.literal("datamanage"),
    z.literal("admin"),
  ]),
  teamNumber: z.number().int().nonnegative(),
  hashedPassword: z.string(),
});
export type User = z.infer<typeof UserSchema>;
export type UserColumn = keyof User;
export const UserColumns: UserColumn[] = [
  "username",
  "permLevel",
  "teamNumber",
  "hashedPassword",
];

export const DBEventSchema = z.object({
  eventKey: z.string(),
  eventName: z.string(),
});
export type DBEvent = z.infer<typeof DBEventSchema>;
export type DBEventColumn = keyof DBEvent;
export const DBEventColumns: DBEventColumn[] = ["eventKey", "eventName"];

export const MatchSchema = z.object({
  eventKey: z.string(),
  matchLevel: z.union([
    z.literal("None"),
    z.literal("Practice"),
    z.literal("Qualification"),
    z.literal("Playoff"),
  ]),
  matchNumber: z.number().int().nonnegative(),
  red1: z.number().int().nonnegative(),
  red2: z.number().int().nonnegative(),
  red3: z.number().int().nonnegative(),
  blue1: z.number().int().nonnegative(),
  blue2: z.number().int().nonnegative(),
  blue3: z.number().int().nonnegative(),
});
export type Match = z.infer<typeof MatchSchema>;
export type MatchColumn = keyof Match;
export const MatchColumns: MatchColumn[] = [
  "eventKey",
  "matchLevel",
  "matchNumber",
  "red1",
  "red2",
  "red3",
  "blue1",
  "blue2",
  "blue3",
];