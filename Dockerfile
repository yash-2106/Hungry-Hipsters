# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy project files to container
COPY . .

# Install dependencies
RUN npm install

# Expose the port (use Render's env var)
EXPOSE 10000

# Start the server
CMD ["node", "server.js"]
