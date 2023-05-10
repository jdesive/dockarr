import {DOCKARR_VERSION} from "../cli";

export const PROWLARR_COMPOSE_FILE = {
    image: "linuxserver/prowlarr:devlop",
    container_name: "prowlarr",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/prowlarr:/config",
    ],
    ports: [
        "9696:9696"
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