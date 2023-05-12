export const WATCHTOWER_COMPOSE_FILE = {
    image: "containrrr/watchtower:latest",
    container_name: "watchtower",
    environment: [
        "TZ=$Timezone",
        "WATCHTOWER_LABEL_ENABLE=true",
        "WATCHTOWER_ROLLING_RESTART=true"
    ],
    volumes: [
        "$DockerSock:/var/run/docker.sock"
    ],
    restart: "always",
    command: "--schedule @midnight --cleanup",
    labels: [
        "com.dockarr.generated=true",
        "com.dockarr.version=$DockarrVersion",
        "com.dockarr.stack=$StackName",
    ]
};