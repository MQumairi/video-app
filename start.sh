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

# --no-cache: rebuild every image from scratch (ignore Docker's layer cache).
NO_CACHE=false
for arg in "$@"; do
  case "$arg" in
    --no-cache) NO_CACHE=true ;;
    *) echo "ERROR: unknown argument '$arg' (supported: --no-cache)"; exit 1 ;;
  esac
done

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

if [ "$NO_CACHE" = true ]; then
  # `up --build` has no --no-cache flag, so do an explicit cache-busting build first.
  echo "Rebuilding all images from scratch (--no-cache) and starting app at http://localhost:3000 ..."
  docker compose -f "$COMPOSE_FILE" build --no-cache
else
  echo "Building images (cached) and starting app at http://localhost:3000 ..."
fi

# --build reuses cached layers: a clean start with no code changes is near-instant.
# (After a --no-cache build above, the images are already fresh, so this is a no-op rebuild.)
docker compose -f "$COMPOSE_FILE" up --build

echo "Shutting down..."
docker compose -f "$COMPOSE_FILE" down
echo "Done."
