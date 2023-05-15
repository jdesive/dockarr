export const METUBE_COMPOSE_FILE = {
    image: "ghcr.io/alexta69/metube:latest",
    container_name: "metube",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone"
    ],
    volumes: [
        "$DataDir/YouTube:/downloads",
    ],
    ports: [
        "8081:8081"
    ],
    restart: "always",
    labels: [
        "com.centurylinklabs.watchtower.enable=true",
        "com.dockarr.generated=true",
        "com.dockarr.version=$DockarrVersion",
        "com.dockarr.stack=$StackName",
    ],
    networks: [
        "$StackName"
    ]
};