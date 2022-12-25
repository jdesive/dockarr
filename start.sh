#!/bin/sh

echo "Setting configuration environment variables"
export "$(xargs < .env)"
echo "Configuration complete"

docker compose up -d
