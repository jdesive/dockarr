export const NPM_COMPOSE_FILE = {
    image: "jc21/nginx-proxy-manager:latest",
    container_name: "nginx-proxy-manager",
    environment: [
        "PUID=$PUID",
        "GUID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022" // Optional
    ],
    volumes: [
        "$ConfigDir/nginx-proxy-manager:/data",
        "$ConfigDir/nginx-proxy-manager/letsencrypt:/etc/letsencrypt",
    ],
    ports: [
        "80:80",
        "81:81",
        "443:443",
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
};