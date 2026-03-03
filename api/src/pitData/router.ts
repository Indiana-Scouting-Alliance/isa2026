import { router } from "../trpc.ts";
import { pitData } from "./pitData.ts";
import { putPitEntries } from "./putPitEntries.ts";

export const pitDataRouter = router({
  pitData: pitData,
  putPitEntries: putPitEntries,
});
