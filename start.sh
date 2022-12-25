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
export HTPC_VPN_PROV="pia"
echo "Configuration complete"

docker compose up -d
