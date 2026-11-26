export const XTEVE_COMPOSE_FILE = [{
    image: "alturismo/xteve:latest",
    container_name: "xteve",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/xteve:/config",
        "$DataDir/Movies:/movies",
        "$DataDir/TV:/tv"
    ],
    ports: [
        "34400:34400"
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