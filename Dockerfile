# ---------- Stage 1: Build stage ----------
FROM node:24-slim AS build

# Install build dependencies
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  pkg-config \
  libsqlite3-dev \
  && rm -rf /var/lib/apt/lists/*

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build your app (transpile TypeScript etc.)
RUN pnpm build

# ---------- Stage 2: Runtime stage ----------
FROM node:24-slim

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only the built app and node_modules from build stage
COPY --from=build /app /app

ENV NODE_ENV=production
CMD ["pnpm", "start"]
