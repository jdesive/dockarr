import {DOCKARR_VERSION} from "../cli";

export const SABNZBD_COMPOSE_FILE = {
    image: "linuxserver/sabnzbd:latest",
    container_name: "sabnzbd",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/sabnzbd:/config",
        "$WorkDir/downloads:/downloads",
        "$WorkDir/incomplete-downloads:/incomplete-downloads"
    ],
    ports: [
        "8080:8080",
        "9090:9090"
    ],
    restart: "always",
    labels: [
        "com.centurylinklabs.watchtower.enable=true",
        "com.dockarr.generated=true",
        "com.dockarr.version=" + DOCKARR_VERSION,
    ],
    networks: [
        "dockarr"
    ]
};