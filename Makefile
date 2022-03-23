init-network:
	docker network inspect backend_network >/dev/null 2>&1 || \
        docker network create --driver bridge backend_network

remove-network:
	docker network rm backend_network || true

gen-proto:
	sh ./scripts/gen-proto.sh

# start all infrastructures (mongodb, redis, kafka).
start-infra: init-network
	sh scripts/start-infra.sh

# stop all infrastructures
stop-infra:
	docker-compose --env-file .env.infra -f docker-compose.infra.yml down