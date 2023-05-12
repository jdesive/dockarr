export const DELUGE_COMPOSE_FILE = {
    image: "binhex/arch-delugevpn:latest",
    container_name: "deluge",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022", // Optional,
        "VPN_ENABLED=$VPNEnabled",
        "VPN_USER=$VPNUser",
        "VPN_PASS=$VPNPass",
        "VPN_PROV=$VPNProv",
        "VPN_CLIENT=$VPNClient",
        "STRICT_PORT_FORWARD=yes",
        "ENABLE_PRIVOXY=yes",
        "LAN_NETWORK=$VPNNetwork",
        "NAME_SERVERS=1.1.1.1,1.0.0.1",
        "DELUGE_DAEMON_LOG_LEVEL=info",
        "DELUGE_WEB_LOG_LEVEL=info",
        "VPN_INPUT_PORTS=1234",
        "VPN_OUTPUT_PORTS=502",
        "DEBUG=false",
    ],
    volumes: [
        "$ConfigDir/deluge:/config",
        "$WorkDir/downloads:/downloads",
        "$WorkDir/incomplete-downloads:/incomplete-downloads"
    ],
    ports: [
        "8112:8112",
        "8118:8118",
        "6881:6881",
        "6881:6881/udp"
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
};