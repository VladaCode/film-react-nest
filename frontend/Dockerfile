FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm config set fetch-retries 5 \
  && npm config set fetch-retry-mintimeout 20000 \
  && npm config set fetch-retry-maxtimeout 120000 \
  && npm ci --no-audit --progress=false \
  && npm i --no-save @rollup/rollup-linux-x64-musl

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM alpine:3.20 AS runner
WORKDIR /app
COPY --from=build /app/dist ./dist
CMD ["sh", "-c", "mkdir -p /frontend-dist && rm -rf /frontend-dist/* && cp -r /app/dist/. /frontend-dist"]
