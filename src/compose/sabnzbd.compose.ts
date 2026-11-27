export const SABNZBD_COMPOSE_FILE = [{
    image: "linuxserver/sabnzbd:latest",
    container_name: "sabnzbd",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/sabnzbd:/config",
        "$DataDir/downloads/usenet:/data/downloads/usenet"
    ],
    ports: [
        "8080:8080",
        "9090:9090"
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