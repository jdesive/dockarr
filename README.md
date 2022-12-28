# Plex Docker
Plex Docker is a opinionated turn-key installation for HTPC setups. It is highly recommended to follow the instructions to a tee and do not modify the repository in order to get the desired and promised outcome. 

It is important to note that this repository can only set up the folders, permissions, network, and services for a dockerized HTPC and cannot actually configure the service. That is up to you.

We do not claim ownership of any services listed or used in this repository. All rights go to the owners of the software used in this repository.
We are not legally responsible for any improper or illegal use of this repository, it is provided for educational purposes only. Use at own risk.  

## Services
- **Plex**: Plex is a one-stop destination to stream movies, tv shows, sports & music
- **Plex-meta-manager**: Plex Meta Manager is an open source Python 3 project that has been designed to ease the creation and maintenance of metadata, collections, and playlists  
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

## Environment Variables

### Required
- HTPC_CONFIG_DIR | Central configuration directory 
- HTPC_DATA_DIR | Media Parent Directory
- HTPC_WORK_DIR | Parent Temporary Directory
- HTPC_VPN_USER | Deluge OpenVPN User
- HTPC_VPN_PASS | Deluge OpenVPN Password
- HTPC_PLEX_CLAIM | Plex TV Claim (https://plex.tv/claim)

### Optional
- HTPC_PGID | `1000` | Group ID
- HTPC_PUID | `1000` | User ID
- HTPC_TIMEZONE | `America/Chicago` | Timezone
- HTPC_VPN_NETWORK | `192.168.1.0/24` | OpenVPN host network for VPN
- HTPC_VPN_ENABLED | `yes` | Enabled VPN on deluge
- HTPC_VPN_PROV | `pia` | VPN provider ("airvpn", "pia", "custom")
- HTPC_VPN_CLIENT | `openvpn` | VPN client ("openvpn", "wireguard")

## Getting started

### Recommended OS
Ubuntu 22.04  

### First time setup
First you will need to add your desired configuration via environment variables to your user on the host machine.
Navigate to the `start.sh` file in this repository and modify the configuration section to your liking. You can view what each environment variable is for above.

Once configuration is complete you can run the start script:
`sudo chmod +x start.sh && ./start.sh`


Now you can move to configuring the individual services via the links above in *Service Links* section above.

### Updating the stack
In order to update the stack (pull new docker images and restart services), you can run the `update.sh` script provided in this repository. 
This will stop all services, update this repo, pull down new docker images if available and rerun the `start.sh` script to bring the services back up.

Note: This will cause downtime for your HTPC, no services will be running during this process. 

### Deleting the stack
To delete the stack you just need to run the `stop.sh` script. This will stop and remove all services.

Note: This does not remove media or configuration files for the HTPC.