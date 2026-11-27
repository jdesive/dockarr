export const RADARR_COMPOSE_FILE = [{
    image: "linuxserver/radarr:latest",
    container_name: "radarr",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/radarr:/config",
        "$DataDir:/data"
    ],
    ports: [
        "7878:7878"
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