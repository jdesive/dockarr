export const TUNARR_COMPOSE_FILE = [{
    image: "chrisbenincasa/tunarr:latest",
    container_name: "tunarr",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
    ],
    volumes: [
        "$ConfigDir/tunarr:/config/tunarr",
        "$DataDir/media:/data/media"
    ],
    restart: "always",
    ports: [
        "8001:8000"
    ],
    labels: [
        "com.dockarr.generated=true",
        "com.dockarr.version=$DockarrVersion",
        "com.dockarr.stack=$StackName",
    ],
    networks: [
        "$StackName"
    ]
}];