# Используем bash
SHELL := /bin/bash

# Имя контейнера (если используешь Docker)
DOCKER_COMPOSE := docker compose

setup:
    
	make up
	make migrate
	make generate
	make start

# ====== Команды для nest ======
gen_module:
	npm run start:dev
	npm nest generate module prisma
	npm nest generate service prisma


# ====== Команды для сервера ======
start:
	npm run start:dev

build:
	npm run build

start-prod:
	npm run start:prod

lint:
	npm run lint

format:
	npm run format

# ====== Команды Prisma ======
reset_migrate:
	npx prisma migrate reset
	npx prisma migrate dev

migrate:
	npx prisma migrate dev

generate:
	npx prisma generate

studio:
	npx prisma studio

# ====== Docker ======
up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

logs:
	$(DOCKER_COMPOSE) logs -f

# ====== Прочие удобные ======
seed:
	npx ts-node prisma/seed.ts

clean:
	rm -rf dist
