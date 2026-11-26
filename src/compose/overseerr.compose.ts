export const OVERSEERR_COMPOSE_FILE = [{
    image: "ghcr.io/seerr-team/seerr:latest",
    container_name: "seerr",
    init: true,
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022", // Optional
        "PORT=5055" // Optional
    ],
    volumes: [
        "$ConfigDir/overseerr:/app/config",
    ],
    ports: [
        "5055:5055"
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