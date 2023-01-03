#!/bin/sh

load_dotenv(){
  # https://stackoverflow.com/a/66118031/134904
  set -a
  # shellcheck disable=SC2039
  source $(cat $1 | sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g")
  set +a
}

CONFIG_DIR=/opt/htpc
CONFIG_FILE=$CONFIG_DIR/htpc.env

if [ ! -x "$(command -v git)" ]; then
    echo "Git is not installed on your system. Running installing git..."
    sudo apt-get install git -y
fi

if [ ! -x "$(command -v docker)" ]; then
    echo "Docker is not installed on your system. Running docker install script..."
    sudo chmod +x docker_install.sh
    . ./docker_install.sh
fi

if [ ! -d "$CONFIG_DIR" ]; then
  echo "Creating HTPC config directory"
  sudo mkdir -p $CONFIG_DIR
fi

if [ ! -s "$CONFIG_FILE" ]; then
    echo "Moving template config file to config directory"
    [ -f "htpc.env" ] && sudo cp htpc.env /opt/htpc/
    echo "Please configure the file \'$CONFIG_FILE\' and re-run this script."
    exit 0
fi

echo "Loading config file..."
load_dotenv "/opt/htpc/htpc.env"

echo "Setting execute permissions on helper scripts..."
sudo chmod +x stop.sh
sudo chmod +x delete.sh
sudo chmod +x update.sh

echo "Starting HTPC docker stack"
docker compose up -d

echo "Changing permissions on data, working, and config directories..."
sudo chmod 775 -R "$HTPC_CONFIG_DIR"
sudo chmod 775 -R "$HTPC_DATA_DIR"
sudo chmod 775 -R "$HTPC_WORK_DIR"
sudo chown -R "$HTPC_PUID:$HTPC_GUID" "$HTPC_CONFIG_DIR"
sudo chown -R "$HTPC_PUID:$HTPC_GUID" "$HTPC_DATA_DIR"
sudo chown -R "$HTPC_PUID:$HTPC_GUID" "$HTPC_WORK_DIR"

echo "Startup complete! Please refer to the README.md document for service links."
