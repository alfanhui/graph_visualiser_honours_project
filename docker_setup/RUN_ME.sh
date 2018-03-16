#! /bin/bash
docker-compose run --rm --entrypoint "npm install" app
docker-compose up -d app
