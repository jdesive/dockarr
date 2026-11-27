export const MEALIE_COMPOSE_FILE = [{
    image: "ghcr.io/mealie-recipes/mealie:latest",
    container_name: "mealie",
    environment: [
        "PUID=$PUID",
        "PGID=$GUID",
        "TZ=$Timezone",
        "UMASK_SET=022", // Optional
        "ALLOW_SIGNUP=false",
        "MAX_WORKERS=1",
        "WEB_CONCURRENCY=1",
        "BASE_URL=https://mealie.$BaseUrl"
    ],
    deploy: {
      resources: {
          limits: {
              memory: "1000M"
          }
      }
    },
    volumes: [
        "$ConfigDir/mealie:/app/data/",
    ],
    ports: [
        "9925:9000"
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