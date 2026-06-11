#!/bin/bash

cd "$(dirname "$0")" || exit

docker compose up
echo "Shutting down..."
docker compose down
echo "Done."