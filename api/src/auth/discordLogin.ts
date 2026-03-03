import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { loggedPublicProcedure } from "../trpc.ts";
import { User } from "../utils/dbtypes.ts";

export const discordLogin = loggedPublicProcedure
  .input(z.object({ code: z.string() }))
  .mutation(async (opts) => {
    const { code } = opts.input;
    const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, DISCORD_GUILD_ID, JWT_PRIVATE_KEY, DB } = opts.ctx.env;

    try {
      const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: DISCORD_REDIRECT_URI,
        }),
      });
  const tokenData = await tokenResponse.json();
  console.log("Token response:", tokenData);
  if (!tokenData.access_token) throw new Error(tokenData);
  
  const guildResponse = await fetch(`https://discord.com/api/users/@me/guilds/${DISCORD_GUILD_ID}/member`, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const guildMember = await guildResponse.json();
  console.log("Guild member response:", guildMember);

      const roleIds = guildMember.roles || [];
      let user: User | null = null;
      for (const roleId of roleIds) {
        user = await DB.prepare(
          "SELECT username, permLevel FROM Users WHERE discordRoleId = ? LIMIT 1;"
        )
          .bind(roleId)
          .first<User>();
        if (user) break;
      }

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Your Discord role is not linked to a user account.",
        });
      }

      const token = jwt.sign(
        { user: { username: user.username, permLevel: user.permLevel } },
        JWT_PRIVATE_KEY,
        { expiresIn: "7d" }
      );

      return {
        token,
        permLevel: user.permLevel,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Discord login failed",
      });
    }
  });