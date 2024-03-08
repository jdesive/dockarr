export const ADGUARDHOME_COMPOSE_FILE = [{
    image: "adguard/adguardhome:latest",
    container_name: "adguardhome",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/adguardhome/work:/opt/adguardhome/work",
        "$DataDir/adguardhome/config:/opt/adguardhome/conf"
    ],
    ports: [
        "5354:53/tcp",
        "5354:53/udp",
        "67:67/udp",
        "68:68/udp",
        "8082:8082/tcp",
        "4433:443/tcp",
        "4433:443/udp",
        "3001:3000/tcp",
        "853:853/tcp",
        "784:784/udp",
        "853:853/udp",
        "8853:8853/udp",
        "5443:5443/tcp",
        "5443:5443/udp",
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