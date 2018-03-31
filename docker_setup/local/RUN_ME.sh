#! /bin/bash
docker-compose run --rm --entrypoint "npm install" huddy_honours_app
docker-compose up -d huddy_honours_app
