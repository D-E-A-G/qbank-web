# The web image: the built screens, served by Caddy on 8080 (see Caddyfile).
# Build from the repository root: docker build -f apps/web/Dockerfile --build-arg APP_VERSION=<commit> .

FROM node:24.19.0-slim AS build
RUN corepack enable
WORKDIR /repo
# Install first from the manifests alone, so a code change reuses the cached install.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @nclex-qbank/web...
COPY . .
RUN pnpm --filter @nclex-qbank/web build

FROM caddy:2.11.4-alpine
ARG APP_VERSION=dev
# The server's deploy checks APP_VERSION here and /version.txt from the container.
ENV APP_VERSION=$APP_VERSION
COPY apps/web/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /repo/apps/web/dist/ /srv/
RUN printf '%s\n' "$APP_VERSION" >/srv/version.txt
# Runs read-only as the image's root user: Caddy writes only under /config and
# /data, which the server mounts as tmpfs, and those mounts are root's alone.
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --start-interval=2s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/version.txt || exit 1
