# Use the latest Node.js LTS version as the base image
FROM node:lts

# Set environment variables (if needed)
# ENV NODE_ENV=production
# ENV PORT=3000

# Create a directory for your application
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files to the container
COPY . .

# Build your application (if necessary, replace with your actual build command)
RUN npm ci

# Expose a port (if your application listens on a specific port)
EXPOSE 5500

# Define the command to run your application (replace with your actual start command)
CMD ["npm", "run" ,"dev"]