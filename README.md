# Plex Docker
This repository houses a few docker-compose scripts that make getting the following services up and running quickly and easily! 

These scripts will handle setting up all the folders, permissions, network, and services for a dockerized HTPC system. You will still need to configure the services after installation. 

## Services

- **Plex**: Plex is a one-stop destination to stream movies, tv shows, sports & music  
- **Jellyfin**: Jellyfin is the volunteer-built media solution that puts you in control of your media  

- **Plex-meta-manager**: Plex Meta Manager is an open source Python 3 project that has been designed to ease the creation and maintenance of metadata, collections, and playlists  
- **Unmanic**: Unmanic is a simple tool for optimising your file library  
- **Tautulli**: Tautulli is a 3rd party application that you can run alongside your Plex Media Server to monitor activity and track various statistics  
- **Sonarr**: Sonarr is an internet PVR for Usenet and Torrents  
- **Radarr**: Radarr is an internet PVR for Usenet and Torrents  
- **Bazarr**: Bazarr is a companion application to Sonarr and Radarr that manages and downloads subtitles based on your requirements  
- **Lidarr**: Lidarr is a music collection manager for Usenet and BitTorrent users  
- **Jellyseerr**: Jellyseerr is a request management and media discovery tool built to work with your existing Plex, Jellyfin, or Emby ecosystem  
- **SABnzbd**: Usenet downloader tool  
- **Prowlarr**: Prowlarr is an indexer manager/proxy built on the popular arr .net/reactjs base stack to integrate with your various PVR apps  
- **Deluge**: Torrent downloader tool

## Service Links
- [Plex](https://plex.tv) | http://localhost:32400/web
- [Jellyfin](https://jellyfin.org/) | http://localhost:8096
- [SABnzbd](https://sabnzbd.org/) | http://localhost:8080
- [Prowlarr](https://github.com/Prowlarr/Prowlarr) | http://localhost:9696
- [Sonarr](https://sonarr.tv/) | http://localhost:8989
- [Radarr](https://radarr.video/) | http://localhost:7878
- [Unmanic]() | http://localhost:8888
- [Tautulli]() | http://localhost:8181
- [Bazarr]() | http://localhost:6767
- [Lidarr]() | http://localhost:8686
- [Jellyseerr]() | http://localhost:5055
- [Deluge]() | http://localhost:8112

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
First you will need to add your desired configuration via environment variables to your user on the host machine. 

Example:  
`export HTPC_CONFIG_DIR=<your path to configs>`

Once configuration is complete you can run the docker compose file:  
`docker compose up -d`

Now you can move to configuring the individual services via the links above in 'Service Links' section.