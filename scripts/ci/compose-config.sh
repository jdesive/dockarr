#!/usr/bin/env bash
# Renders every catalog service on its own and checks the result with "docker compose config".
# Needs a build (npm run build) and Docker with the Compose plugin.
set -euo pipefail

cd "$(dirname "$0")/../.."
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
export HOME="$work/home"

services="$(node -e 'for (const file of require("./bin/src/compose-files.models").COMPOSE_FILES) console.log(file.name)')"

failed=0
index=0
while IFS= read -r service; do
    index=$((index + 1))
    name="ci-$index"
    node bin/src/cli.js create "$name" -s "$service" \
        -c "$work/config" -d "$work/data" \
        --plex-claim claim-ci --advertised-ip http://127.0.0.1:32400 \
        --vpn-user ci --vpn-pass ci --base-url example.com > /dev/null
    if docker compose -f "$HOME/.dockarr/$name/$name.yaml" config --quiet; then
        echo "ok   $service"
    else
        echo "FAIL $service"
        failed=1
    fi
done <<< "$services"

exit "$failed"
