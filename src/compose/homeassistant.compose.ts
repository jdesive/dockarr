export const HOMEASSISTANT_COMPOSE_FILE = [{
    image: "homeassistant/home-assistant:stable",
    container_name: "homeassistant",
    environment: [
        "TZ=$Timezone",
        "PUID=$PUID",
        "$GUID=$GUID"
    ],
    volumes: [
        "$ConfigDir/homeassistant:/config"
    ],
    restart: "always",
    ports: [
      "8123:8123"
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