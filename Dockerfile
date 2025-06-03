FROM node:24

ARG VITE_LATEST_COMMIT_HASH
ENV VITE_LATEST_COMMIT_HASH=$VITE_LATEST_COMMIT_HASH

ARG VITE_LATEST_COMMIT_MESSAGE
ENV VITE_LATEST_COMMIT_MESSAGE=$VITE_LATEST_COMMIT_MESSAGE

# Enable pnpm with corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only the files needed for install first (for caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of your source code
COPY . .

# Build your app
RUN pnpm build

# Set environment and start
ENV NODE_ENV=production
CMD ["pnpm", "start"]