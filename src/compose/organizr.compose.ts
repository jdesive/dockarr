export const ORGANIZR_COMPOSE_FILE = [{
    image: "organizr/organizr:latest",
    container_name: "organizr",
    environment: [
        "TZ=$Timezone",
        "PUID=$PUID",
        "PGID=$GUID"
    ],
    volumes: [
        "$ConfigDir/organizr:/config"
    ],
    restart: "always",
    ports: [
      "8443:80"
    ],
    labels: [
        "com.dockarr.generated=true",
        "com.dockarr.version=$DockarrVersion",
        "com.dockarr.stack=$StackName",
    ],
    networks: [
        "$StackName"
    ]
}];