import {DOCKARR_VERSION} from "../cli";

export const LIDARR_COMPOSE_FILE = {
    image: "linuxserver/lidarr:latest",
    container_name: "lidarr",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/lidarr:/config",
        "$DataDir/Music:/music",
        "$WorkDir/downloads:/downloads",
        "$WorkDir/incomplete-downloads:/incomplete-downloads"
    ],
    ports: [
        "8686:8686"
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