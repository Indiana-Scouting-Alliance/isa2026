import { router } from "../trpc.ts";
import { login } from "./login.ts";
import { discordLogin } from "./discordLogin.ts";
export const authRouter = router({
  login: login,
  discordLogin: discordLogin,
});
