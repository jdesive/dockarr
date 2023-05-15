export const KITANA_COMPOSE_FILE = [{
    image: "pannal/kitana:latest",
    container_name: "kitana",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/kitana:/app/data",
    ],
    ports: [
        "31337:31337"
    ],
    restart: "always",
    labels: [
        "com.centurylinklabs.watchtower.enable=true",
        "com.dockarr.generated=true",
        "com.dockarr.version=$DockarrVersion",
        "com.dockarr.stack=$StackName",
    ],
    command: "-B 0.0.0.0:31337 -P",
    networks: [
        "$StackName"
    ]
}];