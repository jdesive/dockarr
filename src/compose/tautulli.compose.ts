export const TAUTULLI_COMPOSE_FILE = [{
    image: "tautulli/tautulli:latest",
    container_name: "tautulli",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/tautulli:/config",
        "$ConfigDir/plex/logs:/plex_logs:ro",
    ],
    ports: [
        "8181:8181"
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