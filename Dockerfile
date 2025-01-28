FROM node:14-alpine AS base
WORKDIR /app
COPY package.json .

RUN if [ "$NODE_ENV" = "production" ]; \
    then npm install --only=production; \
    else npm install; \
    fi

COPY . .

FROM base as build
RUN npm run build

FROM base as production
COPY --from=build /app/dist ./dist
CMD [ "node", "index.js" ]