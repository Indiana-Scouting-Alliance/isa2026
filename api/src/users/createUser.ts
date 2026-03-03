import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authedLoggedProcedure } from "../trpc.ts";
import { SALT_ROUNDS } from "../utils/auth.ts";
import { UserPermLevel } from "../utils/dbtypes.ts";

export const createUser = authedLoggedProcedure
  .input(
    z.object({
      username: z.string(),
      permLevel: z.enum(UserPermLevel),
      password: z.string(),
      teamNumber: z.number().int().nonnegative(),
      discordRoleId: z.string().optional(),
    })
  )
  .mutation(async (opts) => {
    if (opts.ctx.user.permLevel !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Wrong permissions to fetch data.",
      });
    }

    const hashedPassword = await bcrypt.hash(opts.input.password, SALT_ROUNDS);

    const result = await opts.ctx.env.DB.prepare(
      "INSERT INTO Users (username, permLevel, hashedPassword, teamNumber, discordRoleId) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(
        opts.input.username,
        opts.input.permLevel,
        hashedPassword,
        opts.input.teamNumber,
        opts.input.discordRoleId || null
      )
      .run();

    if (result.success) {
      return;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error while creating user.",
    });
  });
