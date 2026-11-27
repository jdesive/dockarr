export const LIDARR_COMPOSE_FILE = [{
    image: "lscr.io/linuxserver/lidarr:latest",
    container_name: "lidarr",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/lidarr:/config",
        "$DataDir:/data"
    ],
    ports: [
        "8686:8686"
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