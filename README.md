# Dockarr
Dockarr is an opinionated turn-key installation for HTPC setups. It is highly recommended to follow the instructions to a tee and do not modify the repository in order to get the desired and promised outcome. 

It is important to note that this repository can only set up the folders, permissions, network, and services for a dockerized HTPC and cannot actually configure the service. That is up to you.

We do not claim ownership of any services listed or used in this repository. All rights go to the owners of the software used in this repository.
We are not legally responsible for any improper or illegal use of this repository, it is provided for educational purposes only. Use at own risk.  

## Services
- **Plex**: Plex is a one-stop destination to stream movies, tv shows, sports & music
- **Unmanic**: Unmanic is a simple tool for optimising your file library  
- **Tautulli**: Tautulli is a 3rd party application that you can run alongside your Plex Media Server to monitor activity and track various statistics  
- **Sonarr**: Sonarr is an internet PVR for Usenet and Torrents  
- **Radarr**: Radarr is an internet PVR for Usenet and Torrents  
- **Bazarr**: Bazarr is a companion application to Sonarr and Radarr that manages and downloads subtitles based on your requirements  
- **Lidarr**: Lidarr is a music collection manager for Usenet and BitTorrent users  
- **Overseerr**: Overseerr is a request management and media discovery tool built to work with your existing Plex ecosystem  
- **SABnzbd**: Usenet downloader tool  
- **Prowlarr**: Prowlarr is an indexer manager/proxy built on the popular arr .net/reactjs base stack to integrate with your various PVR apps  
- **Deluge**: Torrent downloader tool
- **Requestrr**: Requestrr is a chatbot used to simplify using services like Sonarr/Radarr/Overseerr/Ombi via the use of chat!
- **Nginx-Proxy-Manager**: Expose web services on your network · Free SSL with Let's Encrypt · Designed with security in mind · Perfect for home networks
- **Watchtower**: A container-based solution for automating Docker container base image updates
- **Portainer**: Lightweight service delivery platform for containerized applications that can be used to manage Docker, Swarm, Kubernetes and ACI environments.
- **Searcharr**: This bot allows users to add movies to Radarr, series to Sonarr, and books to Readarr via Telegram messaging app.
- **Ubooquity**: A free home server for your comics and ebooks library
- **Mylar3**: A automated Comic Book (cbr/cbz) downloader program for use with NZB and torrents
- **Readarr**: Readarr is a ebook collection manager for Usenet and BitTorrent users
- **Searcharr**: This bot allows users to add movies to Radarr, series to Sonarr, and books to Readarr via Telegram messaging app
- **EmulatorJS**: Self hosted web based retro emulation front end with rom and art management.

## Service Links
- [Plex](https://plex.tv) | http://localhost:32400/web
- [SABnzbd](https://sabnzbd.org/) | http://localhost:8080
- [Prowlarr](https://github.com/Prowlarr/Prowlarr) | http://localhost:9696
- [Sonarr](https://sonarr.tv/) | http://localhost:8989
- [Radarr](https://radarr.video/) | http://localhost:7878
- [Unmanic](https://github.com/Unmanic/unmanic) | http://localhost:8888
- [Tautulli](https://tautulli.com/) | http://localhost:8181
- [Bazarr](https://www.bazarr.media/) | http://localhost:6767
- [Lidarr](https://lidarr.audio/) | http://localhost:8686
- [Overseerr](https://overseerr.dev/) | http://localhost:5055
- [Deluge](https://deluge-torrent.org/) | http://localhost:8112
- [Requestrr](https://github.com/darkalfx/requestrr) | http://localhost:4545
- [NGINX-proxy-manager](https://nginxproxymanager.com/) | http://localhost:81
- [Portainer](https://www.portainer.io/) | http://localhost:9000
- [Ubooquity](https://vaemendis.net/ubooquity/) | http://localhost:2203/ubooquity/admin
- [Mylar3](https://github.com/mylar3/mylar3) | http://localhost:8090
- [Readarr](https://readarr.com/) | http://localhost:8787
- [EmulatorJS](https://github.com/linuxserver/emulatorjs) | Management: http://localhost:3000 Application: http://localhost:8088

## Configuration

- HTPC_SERVICES | Comma seperated list of services to install (found in `/docker-compose/`)
- HTPC_CONFIG_DIR | `/opt/htpc` | Central configuration directory 
- HTPC_DATA_DIR | `/mnt/Media` | Media Parent Directory
- HTPC_WORK_DIR | `/opt/htpc/tmp` | Parent Temporary Directory
- HTPC_VPN_USER | `exampleUser` | Deluge OpenVPN User
- HTPC_VPN_PASS | `examplePass` | Deluge OpenVPN Password
- HTPC_PLEX_CLAIM | `na` | Plex TV Claim (https://plex.tv/claim)
- HTPC_PGID | `1000` | Group ID
- HTPC_PUID | `1000` | User ID
- HTPC_TIMEZONE | `America/Chicago` | Timezone
- HTPC_VPN_NETWORK | `192.168.1.0/24` | OpenVPN host network for VPN
- HTPC_VPN_ENABLED | `yes` | Enabled VPN on deluge
- HTPC_VPN_PROV | `pia` | VPN provider ("airvpn", "pia", "custom")
- HTPC_VPN_CLIENT | `openvpn` | VPN client ("openvpn", "wireguard")

### Management Settings
- HTPC_DOCKER_SOCK | `/var/run/docker.sock` | The docker sock for access to docker (Watchtower)
- HTPC_UPDATE_CLEANUP | `true` | Whether to clean old docker images after updates

## Getting started

### Recommended OS
Ubuntu 22.04  

### First time setup

During first time setup, the `start.sh` script will install Git and Docker if not already installed and executable by the user. 
The script will also copy a default configuration file to the `/opt/htpc` directory named `htpc.env` and stop executing. 
You will need to configure this file to your specific setup (See above 'Configuration' section) and re-run the `start.sh` script. 
These are one time setup steps, and will not need to be done again after initial setup. 

The first variable option (`HTPC_SERVICES`) in the file allows to configure which services Dockarr will install. 

After re-running the `start.sh` script, it will load in your configuration file and start the HTPC docker stack.

### Starting the Stack
To run the start script first execute:
`sudo chmod +x start.sh`

Then execute:
`./start.sh`


Now you can move to configuring the individual services via the links above in *Service Links* section above.

### Updating the stack
In order to update the stack (pull new docker images and restart services), you can run the `update.sh` script provided in this repository. 
This will stop all services, update this repo, pull down new docker images if available and rerun the `start.sh` script to bring the services back up.

Note: This will cause downtime for your HTPC, no services will be running during this process. 

### Stopping the stack
To stop the stack you can run the `stop.sh` script. This will simply just stop all the services in docker, you can then simply 
run the `start.sh` script again to start the stack back up.

### Deleting the stack
To delete the stack you just need to run the `delete.sh` script. This will stop and remove all services.

Note: This does not remove media or configuration files for the HTPC.

## Networking
All services are provided on a docker bridge network with host port mapping for each service. This way you can configure each service by navigating to `http://<HTPC IP>:<service port>` in your browser.
Provided is `nginx-proxy-manager` in order to allow external access in the system. This would be done by port forwarding port 80 to your HTPC and configuring the NGINX proxy to point to the backend services via their hostnames. 

When configuring a service to connect to another service there are a few ways to do this. 

1. (***Recommended***) Using the services hostname
   1. The docker bridge network that all services are connected to, also modifies each services hosts file to provide nice hostnames for each service. For instance, if you need prowlarr to connect to sonarr, you would put in prowlarr for sonarr's ip just `sonarr` and docker will resolve that to the proper IP for sonarr. 
2. Using the container IP
   1. Using `docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_name_or_id>` will return the ip address of any running docker container in the stack. Then you simply put this in when asked for an ip to the service. 
3. Using the host IP
   1. Because each service has a host port mapping, you can use the host machine ip address to access each service. This is highly discouraged as it creates network loops that are not required.
      (Imagine going out your front door, into the garage, and then into the kitchen every time you want a snack)

## Filesystem
There are 3 main parent directories created by this repository. You can configure them in the `start.sh` script.

- `/opt/htpc`: This is where all configuration, SSL certs, and various persistent settings are stored. (We suggest this be on your main drive, SSD)  
- `/mnt/Media`: This is the Media parent directory. Here is where you Movies, TV Shows, Music, Photos, etc. are stored. (We suggest this be a mounted share from a NAS or SAN)  
- `/opt/htpc/tmp`: This is the working directory for all media. Files that are in the process of downloading or other various temp files are stored here. (We suggest this also be on your main drive, SSD)

## Service Config
Most services are left to set up however you choose via their UI as listed in *Service Links* section, searcharr does require a local settings.py file to be edited with the correct values (There is no UI). 

To edit this file you will need to manually restart the searcharr container after configuring the `searcharrr.py` file, before the changes take effect.
You can do this with `docker restart searcharr`.