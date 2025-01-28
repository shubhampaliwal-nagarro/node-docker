FROM node:14-alpine AS base
WORKDIR /app
COPY package.json .

RUN if [ "$NODE_ENV" = "production" ]; \
    then npm install --only=production; \
    else npm install; \
    fi

COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:14-alpine as production
WORKDIR /app
COPY --from=build /app ./dist
CMD [ "node", "index.js" ]