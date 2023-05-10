import {DOCKARR_VERSION} from "../cli";

export const MYLAR3_COMPOSE_FILE = {
    image: "linuxserver/mylar3:latest",
    container_name: "mylar3",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/mylar3:/config",
        "$DataDir/Comics:/comics",
        "$WorkDir/downloads:/downloads"
    ],
    ports: [
        "8090:8090"
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