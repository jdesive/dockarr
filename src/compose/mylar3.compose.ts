export const MYLAR3_COMPOSE_FILE = [{
    image: "lscr.io/linuxserver/mylar3:latest",
    container_name: "mylar3",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/mylar3:/config",
        "$DataDir:/data"
    ],
    ports: [
        "8090:8090"
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