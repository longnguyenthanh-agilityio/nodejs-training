ARG NODE_VERSION=22.10.0 
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

# Copy package manager files to avoid cache invalidation on code changes
COPY package*.json ./

# Install all dependencies
RUN yarn install

# Copy the entire application code
COPY . .

# -------------------------------------------------------------
# Stage 2: Development Image
FROM build AS development

# Expose the development port
EXPOSE 3000

# Start the application in development mode
CMD ["yarn", "dev"]

# -------------------------------------------------------------
# Stage 3: test Image
FROM build AS test

# Start the application in test mode
CMD ["yarn", "test"]

# -------------------------------------------------------------
# Stage 4: Production Image
FROM build AS production

# Install only production dependencies
RUN yarn install --production --ignore-scripts

# Expose the production port
EXPOSE 4000

# Start the application in production mode
CMD ["yarn", "start"]

