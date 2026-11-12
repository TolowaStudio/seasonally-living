# Next.js standalone server for Cloud Run. Cloud Run sets PORT=8080.
FROM node:22.23.1-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_SHOW_COMPS=0
ARG NEXT_PUBLIC_NOINDEX=0
ENV NEXT_PUBLIC_SHOW_COMPS=$NEXT_PUBLIC_SHOW_COMPS NEXT_PUBLIC_NOINDEX=$NEXT_PUBLIC_NOINDEX
RUN npm run build

FROM node:22.23.1-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=8080 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 8080
CMD ["node", "server.js"]
