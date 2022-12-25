#!/bin/sh

echo "Setting configuration environment variables"
. .env
echo "Configuration complete"

docker compose up -d
