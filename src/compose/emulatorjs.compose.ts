export const EMULATORJS_COMPOSE_FILE = [{
    image: "lscr.io/linuxserver/emulatorjs:latest",
    container_name: "emulatorjs",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/emulatorjs:/config",
        "$DataDir/Roms:/data",
    ],
    ports: [
        "3000:3000",
        "8088:80",
        "4001:4001" // Optional
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