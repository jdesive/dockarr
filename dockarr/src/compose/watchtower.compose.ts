import {DOCKARR_VERSION} from "../cli";

export const WATCHTOWER_COMPOSE_FILE = {
    image: "containrrr/watchtower:latest",
    container_name: "watchtower",
    environment: [
        "WATCHTOWER_SCHEDULE=0 3 * * 6",
        "WATCHTOWER_CLEANUP=true"
    ],
    volumes: [
        "$DockerSock:/var/run/docker.sock"
    ],
    restart: "always",
    labels: [
        "com.dockarr.generated=true",
        "com.dockarr.version=" + DOCKARR_VERSION,
    ]
};