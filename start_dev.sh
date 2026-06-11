#!/bin/bash
#
# Dev launcher: hot-reload, source-mounted (webpack dev server + ts-node-dev).
# For the optimized production build, use ./start.sh instead.
#
# NOTE: this runs under a dedicated Compose project name (video-app-dev) so its
# images/containers/volumes never collide with the production stack. Without this,
# both compose files default to the "video-app" project and build a shared
# "video-app-client" image — running ./start.sh would overwrite it with the
# static prod image (no react-scripts), breaking the next dev start with
# "react-scripts: not found" (exit 127). --build ensures the dev Dockerfile is used.

cd "$(dirname "$0")" || exit 1

PROJECT="video-app-dev"

docker compose -p "$PROJECT" up --build
echo "Shutting down..."
docker compose -p "$PROJECT" down
echo "Done."
