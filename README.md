# Dockarr
An opinionated installation wizard for *arr applications, plex media server, and various other services that make up a HTPC (Home Theater Personal Computer).

**DISCLAIMER:** The author or contributors do not claim ownership of any services listed or used in this repository and are not legally responsible for any 
improper or illegal use of this repository, it is provided for educational purposes only. All rights go to the owners of the software used.  

## Explanation
Setting up a HTPC can be hard for most let alone doing it with best practices and security in mind. We have curated this cli tool in
order to help ease some of that and add in some nice-to-have features that make life a little easier. This started simply with wanting an easily 
deployable and producible script for Plex and companion apps and that is still the goal. 

In order to easily deploy and maintain the services described below, we use Docker as it allows us to spin up and down, update, link, and isolate services. 
This also helps us manage the resources consumed by the various services in a granular way if desired. Each service is in a docker-compose file that describes 
environment, volumes, networks, ports, etc. to allow easy modification and customization. 

This cli tool provides commands that can be used to easily install dependencies, download services, install/uninstall services, and update services. 
It is highly recommended to use the cli an not modify the running services.

## Services

### Docker
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
- **Ubooquity**: A free home server for your comics and ebooks library
- **Mylar3**: A automated Comic Book (cbr/cbz) downloader program for use with NZB and torrents
- **Readarr**: Readarr is a ebook collection manager for Usenet and BitTorrent users
- **Searcharr**: This bot allows users to add movies to Radarr, series to Sonarr, and books to Readarr via Telegram messaging app
- **EmulatorJS**: Self hosted web based retro emulation front end with rom and art management.
- **HomeAssistant**: Home Assistant allows you to get on top of your energy use with its home energy management feature.
- **Organizr**: Organizr allows you to set up "Tabs" that will be loaded all in one webpage. You can then work on your server with ease.

### Operating System
- **Plex Desktop**: Plex desktop client
- **Plex Media Server**: Plex media server (In case you don't want to run it in docker)
- **Spotify**: Spotify is a digital music service that gives you access to millions of songs.
- **Steam**: Steam is the ultimate destination for playing, discussing, and creating games

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
- [HomeAssistant](https://www.home-assistant.io/) | http://localhost:8123
- [Organizr](https://github.com/Organizr) | http://localhost:8443

## Getting started

### Recommended Operating System
Ubuntu 22.04 +  
Windows 10 +

### Installing
You must have [Node.JS](https://nodejs.org/en) & [NPM](https://www.npmjs.com/) installed.  
To install dockarr run the following command:  
`npm install -g dockarr`

You can now see the command options with `dockarr --help`

### Starting the Stack
To create your first stack/deployment you will run the `dockarr create [options] <name>` command and supply your settings when asked. 

If you want to quick start you can copy the command below:  
Linux: `dockarr create -c /opt/htpc -d /mnt/Media -w /opt/htpc/tmp -s 1,2,3,6,8,9,11,13,14 my-first-dockarr`  


Now you can move to configuring the individual services via the links above in *Service Links* section above.

### Updating the stack
In order to update the stack (pull new docker images and restart services), you can run the `update.sh` script provided in this repository. 
This will stop all services, update this repo, pull down new docker images if available and rerun the `start.sh` script to bring the services back up.

Note: This will cause downtime for your HTPC, no services will be running during this process. 

### Stopping the stack
To stop the stack you can run `dockarr stop <name>`. This will simply just stop all the services, you can then simply 
run `dockarr start <name>` again to start the stack back up.

### Deleting the stack
To delete the stack you just need to run `dockarr remove <name>`. This will stop and remove all services.

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

- `Config Dir`: This is where all configuration, SSL certs, and various persistent settings are stored. (We suggest this be on your main drive, SSD)  
- `Data Dir`: This is the Media parent directory. Here is where you Movies, TV Shows, Music, Photos, etc. are stored. (We suggest this be a mounted share from a NAS or SAN)  
- `Work Dir`: This is the working directory for all media. Files that are in the process of downloading or other various temp files are stored here. (We suggest this also be on your main drive, SSD)

## Service Config
Services are left to set up however you choose via their UI as listed in *Service Links* section. However, there are some 
helper commands for you ex. (`dockarr get-api-keys`)