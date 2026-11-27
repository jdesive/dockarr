export const METUBE_COMPOSE_FILE = [{
    image: "ghcr.io/alexta69/metube:latest",
    container_name: "metube",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone"
    ],
    volumes: [
        "$DataDir/media/youtube:/downloads",
    ],
    ports: [
        "8081:8081"
    ],
    restart: "always",
    labels: [
        "com.dockarr.generated=true",
        "com.dockarr.version=$DockarrVersion",
        "com.dockarr.stack=$StackName",
    ],
    networks: [
        "$StackName"
    ]
}];