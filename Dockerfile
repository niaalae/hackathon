FROM node:22-alpine AS build
WORKDIR /app

# Install deps using workspace lockfile
COPY package.json package-lock.json ./
COPY backend/package.json backend/package-lock.json ./backend/
COPY backend/prisma ./backend/prisma
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Runtime image
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/backend ./backend
COPY --from=build /app/frontend ./frontend

RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start"]
