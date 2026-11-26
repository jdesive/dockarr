export const KAVITA_COMPOSE_FILE = [{
    image: "jvmilazz0/kavita:latest",
    container_name: "kavita",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022", // Optional
    ],
    volumes: [
        "$ConfigDir/kavita:/kavita/config",
        "$DataDir/Comics:/comics",
        "$DataDir/Manga:/manga",
        "$DataDir/Books:/books",

    ],
    ports: [
        "5000:5000"
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