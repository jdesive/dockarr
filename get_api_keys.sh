#!/bin/sh

SONARR_API_TOKEN=$(wget -q -O - http://localhost:8989/initialize.js | awk '/apiKey: ([a-z|0-9]*)/ { print $NF }' | grep -Po "([a-z|0-9]*)")
RADARR_API_TOKEN=$(wget -q -O - http://localhost:7878/initialize.js | awk '/apiKey: ([a-z|0-9]*)/ { print $NF }' | grep -Po "([a-z|0-9]*)")
READARR_API_TOKEN=$(wget -q -O - http://localhost:8787/initialize.js | awk '/apiKey: ([a-z|0-9]*)/ { print $NF }' | grep -Po "([a-z|0-9]*)")
LIDARR_API_TOKEN=$(wget -q -O - http://localhost:8686/initialize.js | awk '/apiKey: ([a-z|0-9]*)/ { print $NF }' | grep -Po "([a-z|0-9]*)")

echo "Sonarr: $SONARR_API_TOKEN"
echo "Radarr: $RADARR_API_TOKEN"
echo "Readarr: $READARR_API_TOKEN"
echo "Lidarr: $LIDARR_API_TOKEN"