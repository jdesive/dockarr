export const PROWLARR_COMPOSE_FILE = [{
    image: "lscr.io/linuxserver/prowlarr:develop",
    container_name: "prowlarr",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/prowlarr:/config",
    ],
    ports: [
        "9696:9696"
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