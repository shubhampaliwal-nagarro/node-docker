FROM node:14-alpine AS build
WORKDIR /app
COPY package.json .

RUN if [ "$NODE_ENV" = "production" ]; \
    then npm install --only=production; \
    else npm install; \
    fi

COPY . .


# Production stage
FROM node:14-alpine as production
WORKDIR /app
COPY --from=build /app/dist ./dist
CMD [ "node", "index.js" ]