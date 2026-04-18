# Build stage for frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Build stage for backend
FROM node:18-alpine AS backend-build

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Production stage
FROM node:18-alpine

# Install production dependencies for backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./public

# Copy built backend
COPY --from=backend-build /app/backend/dist ./dist

EXPOSE 8080

CMD ["node", "dist/index.js"]