export const BAZARR_COMPOSE_FILE = {
    image: "lscr.io/linuxserver/bazarr:latest",
    container_name: "bazarr",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/bazarr:/config",
        "$DataDir/Movies:/movies",
        "$DataDir/TV:/tv"
    ],
    ports: [
        "6767:6767"
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