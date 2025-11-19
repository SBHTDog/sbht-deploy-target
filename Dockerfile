# Multi-stage Dockerfile for building and running a Next.js app
# Builder stage: installs deps and builds the app
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

# Install dependencies (using package.json). If you use a lockfile add it to the copy line.
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Runner stage: smaller image with only production deps and build output
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies to keep image small
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy build output and static assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./ || true
COPY --from=builder /app/next.config.ts ./ || true
COPY --from=builder /app/next.config.js ./ || true

EXPOSE 3000

# Use npm start which runs `next start` as defined in package.json
CMD ["npm", "start"]

