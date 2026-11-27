export const SONARR_COMPOSE_FILE = [{
    image: "linuxserver/sonarr:latest",
    container_name: "sonarr",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/sonarr:/config",
        "$DataDir:/data"
    ],
    ports: [
        "8989:8989"
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