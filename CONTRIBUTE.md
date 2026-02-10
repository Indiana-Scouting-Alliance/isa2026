# Development Instructions

Message @liujip0 on Discord if you have any questions.

## Prerequisites

```text
node >= 22.4.0
npm >= 11.2.0
pnpm >= 10.15.0
gh >= 2.67.0
```

## 1. Clone the repo locally

Use either GitHub CLI:

```zsh
gh repo clone Indiana-Scouting-Alliance/isa2026
```

or git:

```zsh
git clone https://github.com/Indiana-Scouting-Alliance/isa2026.git
```

## 2. Navigate to scouting directory

```zsh
cd isa2026
```

## 3. Set default repository

```zsh
gh repo set-default Indiana-Scouting-Alliance/isa2026
```

## 4. Install dependencies

```zsh
pnpm install
```

## 5. Add environment variables

On Mac/Linux:

```zsh
pnpm create-environment
```

On Windows:

```zsh
pnpm create-environment-windows
```

- Get a TheBlueAlliance API key from your [account page](https://www.thebluealliance.com/account) and add it to [`api/.dev.vars`](./api/.dev.vars) as `TBA_API_TOKEN`
- Get an FRC Events API key by registering [here](https://frc-events.firstinspires.org/services/api). Add this key to [`api/.dev.vars`](./api/.dev.vars) as `FIRST_API_TOKEN` in the form of `username:token`.
- Run `openssl rand -base64 32` to generate a new JWT secret and add it to [`api/.dev.vars`](./api/.dev.vars) as `JWT_PRIVATE_KEY`.

## 6. Initialize local database

Change to `api/` folder

```zsh
cd api
```

Apply migrations

```zsh
npx wrangler d1 migrations apply isa2026-db
```

Return to original folder

```zsh
cd ..
```

## 7. Run local development server

```zsh
pnpm dev
```

The frontend will be on `localhost:5173` and the backend will be on `localhost:8787`. Please use event key `2024incmp` (or `2024inpla` and `2024incol` if multiple are needed) for testing on the live app so I can quickly delete test data later.
