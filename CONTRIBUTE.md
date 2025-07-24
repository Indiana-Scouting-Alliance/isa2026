## Development Instructions

Message @liujip0 on Discord if you have any questions.

### 1. Clone the repo locally

Use either GitHub CLI:

```zsh
gh repo clone liujip0/scouting
```

or git:

```zsh
git clone https://github.com/liujip0/scouting.git
```

### 2. Navigate to scouting directory

```zsh
cd scouting
```

### 3. Install dependencies

```zsh
pnpm install
```

### 4. Add environment variables

Copy [`app/src/.env.local.example`](./app/src/.env.local.example) to [`app/src/.env.local`](./app/src/.env.local).

Copy [api/migrations/.dev.vars.example`](./api/migrations/.dev.vars.example) to [`api/migrations/.dev.vars`](./api/migrations/.dev.vars).

### 5. Initialize local database

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

### 6. Run local development server

```zsh
pnpm dev
```

The frontend will be on `localhost:5173` and the backend will be on `localhost:8787`. Please use event key `2024incmp` (or `2024inpla` and `2024incol` if multiple are needed) for testing on the live app so I can quickly delete test data later.
