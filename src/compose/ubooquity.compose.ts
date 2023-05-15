export const UBOOQUITY_COMPOSE_FILE = [{
    image: "lscr.io/linuxserver/ubooquity:latest",
    container_name: "ubooquity",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/ubooquity:/config",
        "$DataDir/Books:/books",
        "$DataDir/Comics:/comics",
        "$DataDir:/files",
    ],
    ports: [
        "2202:2202",
        "2203:2203",
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