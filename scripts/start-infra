env DOCKER_HOST_IP=$(docker network inspect bridge --format='{{(index .IPAM.Config 0).Gateway}}') \
docker-compose --env-file .env.infra -f docker-compose.infra.yml up -d
