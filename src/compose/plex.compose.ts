export const PLEX_COMPOSE_FILE = {
    image: "plexinc/pms-docker:latest",
    container_name: "plex",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "PLEX_CLAIM=$PlexClaim",
        "ADVERTISE_IP=$PlexIp",
        "VERSION=docker"
    ],
    volumes: [
        "$ConfigDir/plex:/config",
        "$WorkDir/plex/transcode:/transcode",
        "$DataDir:/data"
    ],
    restart: "always",
    ports: [
        "1900:1900/udp",
        "3005:3005/tcp",
        "32400:32400/tcp",
        "32410:32410/udp",
        "32412:32412/udp",
        "32413:32413/udp",
        "32414:32414/udp",
        "32469:32469/tcp",
        "8324:8324/tcp"
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
};