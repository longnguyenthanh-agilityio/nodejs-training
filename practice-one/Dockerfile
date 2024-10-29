ARG NODE_VERSION=18.17.1 
# Stage 1: Install all dependencies (dev + prod)
FROM node:${NODE_VERSION} AS build

WORKDIR /app

# Copy package manager files to avoid cache invalidation on code changes
COPY package.json yarn.lock ./

# Install all dependencies
RUN yarn install

# Copy the entire application code
COPY . .

# -------------------------------------------------------------
# Stage 2: Development Image
FROM node:${NODE_VERSION} AS development

WORKDIR /app

# Copy node_modules and the application from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app .

# Expose the development port
EXPOSE 3000

# Start the application in development mode
CMD ["yarn", "dev"]

# -------------------------------------------------------------
# Stage 3: Production Image
FROM node:${NODE_VERSION} AS production

# Install only production dependencies
RUN yarn install --production --ignore-scripts && yarn cache clean

# Expose the production port
EXPOSE 4000

# Start the application in production mode
CMD ["yarn", "start"]

