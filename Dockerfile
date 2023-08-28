#---Development stage---
FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

# Use the node user from the image (instead of the root user because it's more secure)
USER node

#---Build stage---
FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

#copying node_modules from development stage to avoid installing all dependencies again
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV=production

#installing only production dependencies and cleaning the cache to reduce image size
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

USER node

#---Production stage---
FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]