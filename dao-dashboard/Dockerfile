FROM node:23.3.0

WORKDIR /dao-dashboard

# Copy the package.json file
COPY . .

# Install dependencies
RUN yarn install

# Start the application

CMD ["yarn", "dev"]