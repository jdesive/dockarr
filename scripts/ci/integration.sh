#!/usr/bin/env bash
# Starts the core services on real Docker, waits for their web UIs, and checks that a finished
# download can be hardlinked into the media library from inside Sonarr.
# Needs a build (npm run build) and Docker with the Compose plugin. Removes the stack when done.
set -euo pipefail

cd "$(dirname "$0")/../.."
work="$(mktemp -d)"
export HOME="$work/home"
name=ci-core
dockarr() { node bin/src/cli.js "$@"; }

cleanup() {
    status=$?
    if [ "$status" -ne 0 ] && [ -f "$HOME/.dockarr/$name/$name.yaml" ]; then
        docker compose -f "$HOME/.dockarr/$name/$name.yaml" ps -a || true
        docker compose -f "$HOME/.dockarr/$name/$name.yaml" logs --tail 50 || true
    fi
    dockarr remove "$name" -y || true
    # Containers may have written files as other users.
    docker run --rm -v "$work:/work" alpine rm -rf /work/config /work/data || true
    rm -rf "$work"
    exit "$status"
}
trap cleanup EXIT

dockarr create "$name" -s plex,sonarr,radarr,bazarr,prowlarr,seerr,tautulli,sabnzbd,deluge \
    -c "$work/config" -d "$work/data" --puid "$(id -u)" --guid "$(id -g)" --timezone Etc/UTC \
    --plex-claim "" --advertised-ip http://127.0.0.1:32400 --vpn false
dockarr start "$name"

# Any HTTP response counts as up; 000 means nothing answered.
wait_for() {
    local service=$1 url=$2
    for _ in $(seq 1 60); do
        if [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$url")" != "000" ]; then
            echo "up   $service"
            return 0
        fi
        sleep 5
    done
    echo "DOWN $service ($url)"
    return 1
}

wait_for plex http://127.0.0.1:32400/identity
wait_for sonarr http://127.0.0.1:8989/ping
wait_for radarr http://127.0.0.1:7878/ping
wait_for bazarr http://127.0.0.1:6767
wait_for prowlarr http://127.0.0.1:9696/ping
wait_for seerr http://127.0.0.1:5055
wait_for tautulli http://127.0.0.1:8181
wait_for sabnzbd http://127.0.0.1:8080
wait_for deluge http://127.0.0.1:8112

# A download client writes into its own folder; Sonarr sees the same path and hardlinks it.
docker exec sabnzbd sh -c 'mkdir -p /data/downloads/usenet/complete && echo episode > /data/downloads/usenet/complete/episode.mkv'
docker exec sonarr ln /data/downloads/usenet/complete/episode.mkv /data/media/tv/episode.mkv
download="$(stat -c %i "$work/data/downloads/usenet/complete/episode.mkv")"
library="$(stat -c %i "$work/data/media/tv/episode.mkv")"
if [ "$download" != "$library" ]; then
    echo "FAIL hardlink: inodes differ ($download vs $library)"
    exit 1
fi
echo "ok   hardlink from downloads to media"
