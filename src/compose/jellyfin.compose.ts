export const JELLYFIN_COMPOSE_FILE = [{
    image: "jellyfin/jellyfin:latest",
    container_name: "jellyfin",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
    ],
    volumes: [
        "$ConfigDir/jellyfin:/config",
        "$ConfigDir/jellyfin/cache:/cache",
        "$DataDir:/media"
    ],
    restart: "always",
    ports: [
        "8096:8096/tcp",
        "8920:8920/tcp",
        // 1900/udp (DLNA) omitted: conflicts with Plex, and DLNA is a plugin since Jellyfin 10.9
        "7359:7359/udp",
    ],
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