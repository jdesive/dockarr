#!/bin/sh

echo "Setting configuration environment variables"
export HTPC_CONFIG_DIR="/opt/htpc"
export HTPC_DATA_DIR="/mnt/Media"
export HTPC_WORK_DIR="/tmp/htpc"
export HTPC_VPN_ENABLED="yes"
export HTPC_VPN_USER="exampleUser"
export HTPC_VPN_PASS="examplePass"
export HTPC_PGID="1000"
export HTPC_PUID="1000"
export HTPC_TIMEZONE="America/Chicago"
export HTPC_VPN_NETWORK="192.168.1.0/24"
export HTPC_PLEX_CLAIM=""
export HTPC_VPN_PROV="pia"
export HTPC_VPN_CLIENT="openvpn"
export HTPC_UPDATE_CRON="0 3 * * 6"
export HTPC_DOCKER_SOCK="/var/run/docker.sock"
export HTPC_UPDATE_CLEANUP="true"
echo "Configuration complete"

docker compose up -d
