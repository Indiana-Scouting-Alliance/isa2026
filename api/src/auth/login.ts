import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { loggedPublicProcedure } from "../trpc.ts";
import { SALT_ROUNDS } from "../utils/auth.ts";
import { User } from "../utils/dbtypes.ts";

export const login = loggedPublicProcedure
  .input(
    z.object({
      username: z.string(),
      password: z.string(),
    })
  )
  .mutation(async (opts) => {
    const result = await opts.ctx.env.DB.prepare(
      "SELECT username, permLevel, hashedPassword FROM Users WHERE username = ? LIMIT 1;"
    )
      .bind(opts.input.username)
      .first<User>();
    if (result) {
      const passwordMatch = await bcrypt.compare(
        opts.input.password,
        result.hashedPassword
      );

      if (passwordMatch) {
        const token = jwt.sign(
          {
            user: {
              username: opts.input.username,
              permLevel: result.permLevel,
            },
          },
          opts.ctx.env.JWT_PRIVATE_KEY,
          {
            expiresIn: "7d",
          }
        );
        return {
          token: token,
          permLevel: result.permLevel,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
          redirectPath: "/data",
        };
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid login credentials.",
        });
      }
    } else {
      if (opts.input.username === opts.ctx.env.ADMIN_ACCOUNT_USERNAME) {
        const hashedPassword = await bcrypt.hash(
          opts.ctx.env.ADMIN_ACCOUNT_PASSWORD,
          SALT_ROUNDS
        );
        const passwordMatch = await bcrypt.compare(
          opts.input.password,
          hashedPassword
        );
        if (passwordMatch) {
          const adminCreationResult = await opts.ctx.env.DB.prepare(
            "INSERT INTO Users (username, permLevel, hashedPassword, teamNumber) VALUES (?, ?, ?, ?)"
          )
            .bind(
              opts.input.username,
              "admin",
              await bcrypt.hash(
                opts.ctx.env.ADMIN_ACCOUNT_PASSWORD,
                SALT_ROUNDS
              ),
              0
            )
            .run();
          if (!adminCreationResult.success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Error while creating admin account.",
            });
          }

          const token = jwt.sign(
            {
              user: {
                username: opts.input.username,
                permLevel: "admin",
              },
            },
            opts.ctx.env.JWT_PRIVATE_KEY,
            {
              expiresIn: "7d",
            }
          );
          return {
            token: token,
            permLevel: "admin",
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            redirectPath: "/data",
          };
        }
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid login credentials.",
        });
      }
    }
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid login credentials.",
    });
  });
