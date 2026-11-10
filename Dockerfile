# syntax=docker/dockerfile:1

# ---- base: pnpm from the packageManager field in package.json ----
FROM node:26.13.0-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g "$(node -p "require('./package.json').packageManager")" && npm cache clean --force

# ---- deps: everything the build needs ----
FROM base AS deps
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile --store-dir=/pnpm/store

# ---- build: the React Router app (client + server bundle) ----
FROM deps AS build
COPY . .
# Shown in the app; only the build stage sees these
ARG VITE_LATEST_COMMIT_HASH
ARG VITE_LATEST_COMMIT_MESSAGE
ENV VITE_LATEST_COMMIT_HASH=$VITE_LATEST_COMMIT_HASH \
  VITE_LATEST_COMMIT_MESSAGE=$VITE_LATEST_COMMIT_MESSAGE
RUN pnpm build

# ---- prod-deps: runtime dependencies only (better-sqlite3 is native, so this
# installs for the target platform) ----
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile --prod --store-dir=/pnpm/store

# ---- runtime ----
FROM node:26.13.0-alpine AS runtime
# tini as PID 1: forwards signals and reaps zombies
RUN apk add --no-cache tini

WORKDIR /app
# App files stay owned by root, so the app can't modify itself
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./
COPY app/database/migrations ./migrations

# The database lives in a volume at /data. Named volumes take this directory's
# owner, so the non-root "node" user (uid 1000) can write to it; a bind mount
# needs the host directory chowned to 1000:1000.
RUN mkdir -p /data && chown node:node /data
USER node

ENV NODE_ENV=production \
  PORT=3000 \
  DATABASE_PATH=/data/data.db \
  MIGRATIONS_PATH=/app/migrations
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1:3000/api/projects || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node_modules/.bin/react-router-serve", "./build/server/index.js"]
