export const TUBESYNC_COMPOSE_FILE = [{
    image: "ghcr.io/meeb/tubesync:latest",
    container_name: "tubesync",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/tubesync:/config",
        "$DataDir/YouTube:/downloads",
    ],
    ports: [
        "4848:4848"
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
}];