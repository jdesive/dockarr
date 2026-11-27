export const DUPLICATI_COMPOSE_FILE = [{
    image: "linuxserver/duplicati:latest",
    container_name: "duplicati",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/duplicati:/config",
        "$ConfigDir/duplicati/backups:/backups",
        "$DataDir:/source"
    ],
    ports: [
        "8200:8200"
    ],
    restart: "always",
    labels: [
        "com.dockarr.generated=true",
        "com.dockarr.version=$DockarrVersion",
        "com.dockarr.stack=$StackName",
    ],
    networks: [
        "$StackName"
    ]
}];