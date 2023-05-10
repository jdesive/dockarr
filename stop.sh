#!/bin/sh

load_dotenv() {
  env=${1:-.env}
  [ ! -f "${env}" ] && {
    echo "[Dockarr] Env file ${env} doesn't exist"
    return 1
  }
  eval $(sed -e '/^\s*$/d' -e '/^\s*#/d' -e 's/=/="/' -e 's/$/"/' -e 's/^/export /' "${env}")
}

echo "[Dockarr] Loading config file..."
load_dotenv "$CONFIG_FILE"

services=${HTPC_SERVICES:-$1}

for service in $(echo "$services" | sed "s/,/ /g")
do
  filePath="docker-compose/$service.yml"

  if [ ! -f "$filePath" ]; then
    echo "[Dockarr] '$filePath' does not exist. Failed to run services. Moving to next..."
    continue;
  fi

  echo "[Dockarr] Stopping stack '$service'..."
  docker compose -f "$filePath" down
done