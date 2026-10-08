#!/bin/sh
set -eu
cd /srv/projects/mycloud
if [ ! -f .env.deploy ]; then
    umask 077
    {
        printf 'DB_PASSWORD=%s\n' "$(openssl rand -hex 32)"
        printf 'SECRET_KEY=%s\n' "$(openssl rand -hex 40)"
        printf '%s\n' 'ALLOWED_HOSTS=localhost,127.0.0.1' \
          'CORS_ALLOWED_ORIGINS=http://localhost:5173' \
          'CSRF_TRUSTED_ORIGINS=http://localhost:5173' \
          'TRUST_PROXY=False' 'COOKIE_SECURE=False' 'COOKIE_SAMESITE=Lax' \
          'SECURE_SSL_REDIRECT=False' 'MYCLOUD_PORT=18081'
    } > .env.deploy
fi
docker compose --env-file .env.deploy config --quiet
docker compose --env-file .env.deploy build backend
docker compose --env-file .env.deploy up -d database
docker compose --env-file .env.deploy run --rm backend python manage.py test --noinput
docker compose --env-file .env.deploy run --rm backend python manage.py migrate --noinput
docker compose --env-file .env.deploy run --rm backend python manage.py collectstatic --noinput
docker compose --env-file .env.deploy up -d
