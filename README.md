# Dockarr
![npm](https://img.shields.io/npm/v/dockarr?style=for-the-badge)
![GitHub package.json version](https://img.shields.io/github/package-json/v/jdesive/dockarr?label=GitHub&style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/jdesive/dockarr?style=for-the-badge)
![GitHub Repo stars](https://img.shields.io/github/stars/jdesive/dockarr?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/jdesive/dockarr?style=for-the-badge)
![npm](https://img.shields.io/npm/dw/dockarr?style=for-the-badge)

An opinionated CLI tool for installing and managing [*arr applications](https://wiki.servarr.com/), [Plex Media Server](https://plex.tv), and various other services that make up a HTPC (Home Theater Personal Computer).

**DISCLAIMER:** The author or contributors do not claim ownership of any services listed or used in this repository and are not legally responsible for any 
improper or illegal use of this repository, it is provided for educational purposes only. All rights go to the owners of the software used.

## Links
- [Source](https://github.com/jdesive/dockarr) - https://github.com/jdesive/dockarr
- [NPM](https://www.npmjs.com/package/dockarr) - https://www.npmjs.com/package/dockarr

## Available Services

- **[Plex](https://plex.tv)**: Plex is a one-stop destination to stream movies, tv shows, sports & music
- **[Unmanic](https://github.com/Unmanic/unmanic)**: Unmanic is a simple tool for optimising your file library  
- **[Tautulli](https://tautulli.com/)**: Tautulli is a 3rd party application that you can run alongside your Plex Media Server to monitor activity and track various statistics  
- **[Sonarr](https://sonarr.tv/)**: Sonarr is an internet PVR for Usenet and Torrents  
- **[Radarr](https://radarr.video/)**: Radarr is an internet PVR for Usenet and Torrents  
- **[Bazarr](https://www.bazarr.media/)**: Bazarr is a companion application to Sonarr and Radarr that manages and downloads subtitles based on your requirements  
- **[Lidarr](https://lidarr.audio/)**: Lidarr is a music collection manager for Usenet and BitTorrent users  
- **[Overseerr](https://overseerr.dev/)**: Overseerr is a request management and media discovery tool built to work with your existing Plex ecosystem  
- **[SABnzbd](https://sabnzbd.org/)**: Usenet downloader tool  
- **[Prowlarr](https://github.com/Prowlarr/Prowlarr)**: Prowlarr is an indexer manager/proxy built on the popular arr .net/reactjs base stack to integrate with your various PVR apps  
- **[Deluge](https://deluge-torrent.org/)**: Torrent downloader tool
- **[Nginx-Proxy-Manager](https://nginxproxymanager.com/)**: Expose web services on your network · Free SSL with Let's Encrypt · Designed with security in mind · Perfect for home networks
- **[Portainer](https://www.portainer.io/)**: Lightweight service delivery platform for containerized applications that can be used to manage Docker, Swarm, Kubernetes and ACI environments.
- **[Mylar3](https://github.com/mylar3/mylar3)**: A automated Comic Book (cbr/cbz) downloader program for use with NZB and torrents
- **[HomeAssistant](https://www.home-assistant.io/)**: Home Assistant allows you to get on top of your energy use with its home energy management feature.
- **[Organizr](https://github.com/Organizr)**: Organizr allows you to set up "Tabs" that will be loaded all in one webpage. You can then work on your server with ease.
- **[Duplicati](https://www.duplicati.com/)**: Free backup software to store encrypted backups online
- **[TubeSync](https://github.com/meeb/tubesync)**: TubeSync is a PVR for YouTube
- **[MeTube](https://github.com/alexta69/metube)**: Web GUI for youtube-dl. Allows you to download videos from YouTube and dozens of other sites.
- **[ADGuardHome](https://adguard.com/en/welcome.html)**: AdGuard is the best way to get rid of annoying ads and online tracking and protect your computer from malware
- **[Mealie](https://mealie.io/)**: An intuitive and easy to use recipe management app.
- **[Kavita](https://www.kavitareader.com/)**: Lighting fast with a slick design, Kavita is a rocket fueled self-hosted digital library which supports a vast array of file formats.
- **[Jellyfin](https://jellyfin.org/)**: Jellyfin is the volunteer-built media solution that puts you in control of your media. Stream to any device from your own server, with no strings attached. Your media, your server, your way.
- **[Tunarr](https://github.com/chrisbenincasa/tunarr)**: Tunarr lets you build custom live TV channels out of your existing media libraries — movies, TV episodes, music videos, or local files — and stream them as if they were real broadcast channels.

## Getting started

### Recommended Operating System
Ubuntu 22.04 +  
Windows 10 +

### Installing
Dockarr needs:
- [Node.js](https://nodejs.org/en) 22 or later, with npm
- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin v2 (`docker compose version` must work). On Linux install [Docker Engine](https://docs.docker.com/engine/install/); on Windows install [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/).

Dockarr doesn't install Docker or any other software for you; `create` stops with an error if Docker Compose isn't found.  

To install dockarr run the following command:  
`npm install -g dockarr`

You can now see the command options with `dockarr --help`

### Starting the Stack
To create your first stack/deployment you will run the `dockarr create [options] <name>` command and supply your settings when asked. 
Services can be picked by name or by their number in the list, e.g. `-s plex,sonarr,radarr`. If you pick Deluge you will be asked for your VPN login (or pass `--vpn false`).

If you want to quick start you can copy the command below:  
Linux: `dockarr create -c /opt/htpc -d /mnt/data -s plex,sonarr,radarr,bazarr,prowlarr,seerr,tautulli,sabnzbd,deluge my-first-dockarr`  
Windows: `dockarr create -c ./htpc -d ./data -s plex,sonarr,radarr,bazarr,prowlarr,seerr,tautulli,sabnzbd,deluge my-first-dockarr`

`create` only writes the compose file. Start the stack with `dockarr start my-first-dockarr`. To change an existing deployment, re-run `create` with `--force`.

Now you can move to configuring the individual services via the links above in *Service Links* section below.

### Updating the stack
In order to update the stack (pull new docker images and restart services), you can run `dockarr update <name>`. 
This pulls new docker images while your services keep running, then recreates only the containers whose image changed. Use `-s` to update specific services.

### Stopping the stack
To stop the stack you can run `dockarr stop <name>`. This will simply just stop all the services, you can then simply 
run `dockarr start <name>` again to start the stack back up.

### Deleting the stack
To delete the stack you just need to run `dockarr remove <name>`. This will stop and remove all services after asking for confirmation (skip it with `-y`).

Note: This does not remove media or configuration files for the HTPC.

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
- [NGINX-proxy-manager](https://nginxproxymanager.com/) | http://localhost:81
- [Portainer](https://www.portainer.io/) | http://localhost:9000
- [Mylar3](https://github.com/mylar3/mylar3) | http://localhost:8090
- [HomeAssistant](https://www.home-assistant.io/) | http://localhost:8123
- [Organizr](https://github.com/Organizr) | http://localhost:8443
- [Duplicati](https://www.duplicati.com/) | http://localhost:8200
- [TubeSync](https://github.com/meeb/tubesync) | http://localhost:4848
- [MeTube](https://github.com/alexta69/metube) | http://localhost:8081
- [ADGuardHome](https://adguard.com/en/welcome.html) | http://localhost:3001
- [Mealie](https://mealie.io/) | http://localhost:9925
- [Kavita](https://www.kavitareader.com/) | http://localhost:5000
- [Jellyfin](https://jellyfin.org/) | http://localhost:8096
- [Tunarr](https://github.com/chrisbenincasa/tunarr) | http://localhost:8001

## Explanation
Setting up a HTPC can be hard for most let alone doing it with best practices and security in mind. Unsatisfied with the installation tools out there currently,
we have created and tested this cli tool in order to help ease some of those headaches and add in some nice-to-have features to make life a little easier. This started
simply with wanting an easily deployable and producible script for Plex and companion apps and that is still the goal.

### Security
While Dockarr aims to simplify deployment, it is important to follow security best practices:
- **Docker Socket**: Portainer requires access to `/var/run/docker.sock`. This provides the container with near-root access to the host machine. Only use these services if you trust them and understand the risks.
- **Insecure Connections**: By default, many services are exposed over plain HTTP. It is highly recommended to use a reverse proxy (like the included Nginx Proxy Manager) with SSL/TLS for all external access.
- **Secrets**: The generated compose file (`~/.dockarr/<name>/<name>.yaml`) contains your Plex claim and VPN credentials, so Dockarr makes it readable only by your user. Note that anyone with access to Docker can still read container environment variables via `docker inspect`.
- **API Keys**: Commands like `get-api-keys` fetch information over plain HTTP within your network. Ensure your local network is secure.
- **Image Versions**: Dockarr currently uses `:latest` tags for ease of use and updates. For production environments, consider pinning to specific versions or digests in the generated compose files for better reproducibility.

### Networking
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

### Filesystem
Dockarr uses two parent directories, set with `create`:

- `-c, --config-dir`: configuration, SSL certs, Plex transcodes and other persistent settings. (We suggest your main drive, SSD)
- `-d, --data-dir`: downloads and media together, so that Sonarr, Radarr and Lidarr can [hardlink and atomically move](https://wiki.servarr.com/docker-guide#consistent-and-well-planned-paths) finished downloads instead of copying them. It must be a single filesystem. (A local disk, or one mounted share from a NAS or SAN)

`create` sets up this layout inside the data directory:

```
data/
├── downloads/
│   ├── torrents/   Deluge
│   └── usenet/     SABnzbd
└── media/
    ├── movies/  tv/  music/  books/  comics/  youtube/
```

Every container sees it at the same path, `/data`. When you configure the apps:
- Set the download clients' download folders inside `/data/downloads/torrents` or `/data/downloads/usenet`.
- Set the root folders in Sonarr, Radarr and Lidarr to `/data/media/tv`, `/data/media/movies` and `/data/media/music`.
- Add libraries in Plex or Jellyfin from `/data/media`.

Dockarr 1.x used separate `Data` and `Work` directories with different container paths. Those deployments need their paths and root folders updated for 2.0.

### AdGuard Home and port 53
AdGuard Home publishes DNS on port 53. On Ubuntu, systemd-resolved already listens there, and `create` warns when it finds something on port 53. To free the port, as [AdGuard Home recommends](https://github.com/AdguardTeam/AdGuardHome/wiki/Docker#resolved-daemon):

```
sudo mkdir -p /etc/systemd/resolved.conf.d
printf '[Resolve]\nDNS=127.0.0.1\nDNSStubListener=no\n' | sudo tee /etc/systemd/resolved.conf.d/adguardhome.conf
sudo mv /etc/resolv.conf /etc/resolv.conf.backup
sudo ln -s /run/systemd/resolve/resolv.conf /etc/resolv.conf
sudo systemctl reload-or-restart systemd-resolved
```

In the AdGuard Home setup wizard, keep the admin interface on port 3000 so it stays reachable at http://localhost:3001. DHCP ports are not published.

### Service Config
Services are left to set up however you choose via their UI as listed in *Service Links* section. However, there are some 
helper commands for you ex. (`dockarr get-api-keys`)

## Development
- `npm run build` compiles to `bin/`; run the CLI locally with `node bin/src/cli.js`.
- `npm test` runs the unit tests in `test/` (requires Node 22+). They also check every compose template for unknown placeholders, missing PGID, duplicate container names, host port conflicts and consistent `/data` paths, so run them after adding a service.
- CI also runs `scripts/ci/compose-config.sh`, which renders every service and checks it with `docker compose config`, and `scripts/ci/integration.sh`, which starts the core services on real Docker and checks that a download hardlinks into the media library. Both need `npm run build` and Docker.

## Disclaimer
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.