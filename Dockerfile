FROM node:24-slim

WORKDIR /app

COPY pnpm-lock.yaml package.json ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

COPY . .

RUN npm run build

CMD ["npm", "start"]