import {PLEX_COMPOSE_FILE} from "./compose/plex.compose";
import {SONARR_COMPOSE_FILE} from "./compose/sonar.compose";
import {RADARR_COMPOSE_FILE} from "./compose/radarr.compose";
import {LIDARR_COMPOSE_FILE} from "./compose/lidarr.compose";
import {BAZARR_COMPOSE_FILE} from "./compose/bazarr.compose";
import {MYLAR3_COMPOSE_FILE} from "./compose/mylar3.compose";
import {PROWLARR_COMPOSE_FILE} from "./compose/prowlarr.compose";
import {OVERSEERR_COMPOSE_FILE} from "./compose/overseerr.compose";
import {TAUTULLI_COMPOSE_FILE} from "./compose/tautulli.compose";
import {UNMANIC_COMPOSE_FILE} from "./compose/unmanic.compose";
import {SABNZBD_COMPOSE_FILE} from "./compose/sabnzbd.compose";
import {DELUGE_COMPOSE_FILE} from "./compose/deluge.compose";
import {NPM_COMPOSE_FILE} from "./compose/nginx-proxy-manager.compose";
import {PORTAINER_COMPOSE_FILE} from "./compose/portainer.compose";
import {HOMEASSISTANT_COMPOSE_FILE} from "./compose/homeassistant.compose";
import {ORGANIZR_COMPOSE_FILE} from "./compose/organizr.compose";
import {DUPLICATI_COMPOSE_FILE} from "./compose/duplicati.compose";
import {TUBESYNC_COMPOSE_FILE} from "./compose/tubesync.compose";
import {METUBE_COMPOSE_FILE} from "./compose/metube.compose";
import {ADGUARDHOME_COMPOSE_FILE} from "./compose/adguardhome.compose";
import {MEALIE_COMPOSE_FILE} from "./compose/mealie.compose.yaml";
import {KAVITA_COMPOSE_FILE} from "./compose/kavita.compose.yaml";
import {JELLYFIN_COMPOSE_FILE} from "./compose/jellyfin.compose";
import { TUNARR_COMPOSE_FILE } from "./compose/tunarr.compose";

export interface DockerComposeFile {
    name: string;
    services: object[];
}

export const COMPOSE_FILES: DockerComposeFile[] = [
    {name: 'Plex', services: PLEX_COMPOSE_FILE},
    {name: 'Sonarr', services: SONARR_COMPOSE_FILE},
    {name: 'Radarr', services: RADARR_COMPOSE_FILE},
    {name: 'Lidarr', services: LIDARR_COMPOSE_FILE},
    {name: 'Bazarr', services: BAZARR_COMPOSE_FILE},
    {name: 'Mylar3', services: MYLAR3_COMPOSE_FILE},
    {name: 'Prowlarr', services: PROWLARR_COMPOSE_FILE},
    {name: 'Seerr', services: OVERSEERR_COMPOSE_FILE},
    {name: 'Tautulli', services: TAUTULLI_COMPOSE_FILE},
    {name: 'Unmanic', services: UNMANIC_COMPOSE_FILE},
    {name: 'SABnzbd', services: SABNZBD_COMPOSE_FILE},
    {name: 'Deluge', services: DELUGE_COMPOSE_FILE},
    {name: 'NGINX-proxy-manager', services: NPM_COMPOSE_FILE},
    {name: 'Portainer', services: PORTAINER_COMPOSE_FILE},
    {name: 'HomeAssistant', services: HOMEASSISTANT_COMPOSE_FILE},
    {name: 'Organizr', services: ORGANIZR_COMPOSE_FILE},
    {name: 'Duplicati', services: DUPLICATI_COMPOSE_FILE},
    {name: 'TubeSync', services: TUBESYNC_COMPOSE_FILE},
    {name: 'MeTube', services: METUBE_COMPOSE_FILE},
    {name: 'ADGuardHome', services: ADGUARDHOME_COMPOSE_FILE},
    {name: 'Mealie', services: MEALIE_COMPOSE_FILE},
    {name: 'Kavita', services: KAVITA_COMPOSE_FILE},
    {name: 'Jellyfin', services: JELLYFIN_COMPOSE_FILE},
    {name: 'Tunarr', services: TUNARR_COMPOSE_FILE},
]