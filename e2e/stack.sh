#!/usr/bin/env bash
# Starts and stops the site for the end-to-end tests (compose.yaml): Postgres,
# the API image pinned in apps/web/contract/pin.json with its migrations
# applied the way the deploy applies them, the web image built from this
# checkout, and Caddy in front, at http://localhost:4318. CI runs the same.
#
#   e2e/stack.sh up     build the web image, start everything, wait until healthy
#   e2e/stack.sh logs   print every container's log
#   e2e/stack.sh down   stop it and drop the database
#
# Pulling the API image needs `docker login ghcr.io` with read access to the
# nclex-qbank-api package. API_IMAGE, when set, runs another API image instead,
# such as one built from a qbank-server checkout.
set -Eeuo pipefail

cd "$(dirname "$0")/.."
API_IMAGE="${API_IMAGE:-$(node -p 'require("./apps/web/contract/pin.json").image')}"
export API_IMAGE
compose=(docker compose -f e2e/compose.yaml)

case "${1:-}" in
  up)
    docker build -f apps/web/Dockerfile --build-arg APP_VERSION=e2e -t qbank-web:e2e .
    "${compose[@]}" up --detach --wait db
    "${compose[@]}" run --rm --no-deps api node migrate.js
    "${compose[@]}" up --detach --wait
    ;;
  logs) "${compose[@]}" logs --no-color ;;
  down) "${compose[@]}" down --volumes ;;
  *)
    echo "usage: e2e/stack.sh up|logs|down" >&2
    exit 2
    ;;
esac
