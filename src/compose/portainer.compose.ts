export const PORTAINER_COMPOSE_FILE = {
    image: "portainer/portainer-ce:latest",
    container_name: "portainer",
    security_opt: [
        "no-new-privileges:true"
    ],
    volumes: [
        "$DockerSock:/var/run/docker.sock",
        "$ConfigDir/portainer:/data"
    ],
    ports: [
        "9000:9000"
    ],
    restart: "always",
    labels: [
        "com.centurylinklabs.watchtower.enable=true",
        "com.dockarr.generated=true",
        "com.dockarr.version=$DockarrVersion",
        "com.dockarr.stack=$StackName",
    ]
};