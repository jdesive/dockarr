#!/bin/sh

# Remove any previous installations in apt before moving forward
sudo apt-get remove docker docker-engine docker.io containerd runc -y

# Note: Uncomment to remove images, containers, volumes, and networks
# sudo rm -rf /var/lib/docker/

sudo apt-get update -y
sudo apt-get install ca-certificates curl gnupg lsb-release -y

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo chmod a+r /etc/apt/keyrings/docker.gpg
sudo apt-get update -y

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y

sudo systemctl enable docker.service
sudo systemctl enable containerd.service

# Note: https://docs.docker.com/engine/install/linux-postinstall/ (Should do perms diff for better security)
sudo groupadd docker
sudo usermod -aG docker "$USER"
newgrp docker