import {DOCKARR_VERSION} from "../cli";

export const OVERSEERR_COMPOSE_FILE = {
    image: "linuxserver/overseerr:latest",
    container_name: "overseerr",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/overseerr:/config",
    ],
    ports: [
        "5055:5055"
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