# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Set NODE_ENV to production
ENV NODE_ENV production

# Run the app
CMD ["node", "build/index.js"]