export const SONARR_COMPOSE_FILE = [{
    image: "linuxserver/sonarr:latest",
    container_name: "sonarr",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/sonarr:/config",
        "$DataDir/TV:/tv",
        "$WorkDir/downloads:/downloads",
        "$WorkDir/incomplete-downloads:/incomplete-downloads"
    ],
    ports: [
        "8989:8989"
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