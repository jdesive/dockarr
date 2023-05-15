export const UNMANIC_COMPOSE_FILE = [{
    image: "josh5/unmanic:latest",
    container_name: "unmanic",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/unmanic:/config",
        "$DataDir:/library",
        "$WorkDir/unmanic:/tmp/unmanic",
    ],
    ports: [
        "8888:8888"
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