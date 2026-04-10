# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source and build script
COPY . .

# Build the project
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the bundled application from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the application port (defaulting to 3000 as per src/index.ts)
EXPOSE 3000

# Start the application using the production command
CMD ["npm", "start"]
