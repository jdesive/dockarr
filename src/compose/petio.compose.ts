export const PETIO_COMPOSE_FILE = [
    {
        image: "ghcr.io/petio-team/petio:latest",
        container_name: "petio",
        environment: [
            "TZ=$Timezone",
            "UMASK_SET=022" // Optional
        ],
        user: "$PUID:$GUID",
        volumes: [
            "$ConfigDir/petio:/app/api/config",
            "$ConfigDir/petio/logs:/app/logs",
        ],
        ports: [
            "7777:7777"
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
    },
    {
        image: "mongo:4.4",
        container_name: "petio_mongo",
        hostname: "petio_mongo",
        user: "$PUID:$GUID",
        volumes: [
            "$ConfigDir/petio/mongodb:/data/db",
        ],
        networks: [
            "$StackName"
        ]
    }
];