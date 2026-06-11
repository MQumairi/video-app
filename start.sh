#!/bin/bash
#
# Production launcher: builds (and caches) the client/server images and runs the app
# as an optimized static build — no hot reload, no slow webpack dev server.
#
# Media is mounted from the path in the repo-root MEDIAPATH file. That path must point
# to a folder containing "videos" and "images" subdirectories.
#
# For the dev workflow (hot-reload, source-mounted), use ./start_dev.sh instead.

cd "$(dirname "$0")" || exit 1

COMPOSE_FILE="docker-compose.prod.yml"

if [ ! -f MEDIAPATH ]; then
  echo "ERROR: MEDIAPATH file not found in repo root."
  echo "Create it with the absolute path to your media folder (must contain 'videos' and 'images'):"
  echo "  echo /absolute/path/to/media > MEDIAPATH"
  exit 1
fi

MEDIA_ROOT="$(tr -d '[:space:]' < MEDIAPATH)"

if [ -z "$MEDIA_ROOT" ]; then
  echo "ERROR: MEDIAPATH is empty. Put the absolute path to your media folder in it."
  exit 1
fi
if [ ! -d "$MEDIA_ROOT/videos" ] || [ ! -d "$MEDIA_ROOT/images" ]; then
  echo "ERROR: '$MEDIA_ROOT' must contain 'videos' and 'images' subdirectories."
  exit 1
fi

export MEDIA_ROOT
echo "Media root: $MEDIA_ROOT"
echo "Building images (cached) and starting app at http://localhost:3000 ..."

# --build reuses cached layers: a clean start with no code changes is near-instant.
docker compose -f "$COMPOSE_FILE" up --build

echo "Shutting down..."
docker compose -f "$COMPOSE_FILE" down
echo "Done."
