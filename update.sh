#!/bin/sh

docker compose down
git fetch --all
git reset --hard origin/master
docker compose pull
. ./start.sh