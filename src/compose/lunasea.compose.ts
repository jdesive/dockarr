export const LUNASEA_COMPOSE_FILE = [{
    image: "ghcr.io/jagandeepbrar/lunasea:stable",
    container_name: "lunasea",
    ports: [
        "5423:80"
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