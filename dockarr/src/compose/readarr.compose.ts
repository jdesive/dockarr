import {DOCKARR_VERSION} from "../cli";

export const READARR_COMPOSE_FILE = {
    image: "linuxserver/readarr:latest",
    container_name: "readarr",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/readarr:/config",
        "$DataDir/Books:/books",
        "$WorkDir/downloads:/downloads",
        "$WorkDir/incomplete-downloads:/incomplete-downloads"
    ],
    ports: [
        "8787:8787"
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