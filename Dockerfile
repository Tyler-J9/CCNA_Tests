FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080
COPY --chown=node:node server.js engine.js index.html ./
USER node
EXPOSE 8080
CMD ["node", "server.js"]
