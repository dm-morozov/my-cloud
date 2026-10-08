#!/bin/sh
set -eu
cd /srv/projects/mycloud
install -m 644 deploy/cloud-http.conf /etc/nginx/sites-available/mycloud-http
ln -sf /etc/nginx/sites-available/mycloud-http /etc/nginx/sites-enabled/mycloud-http
nginx -t
systemctl reload nginx
certbot certonly --webroot -w /var/lib/letsencrypt -d cloud.mu56.ru --non-interactive
install -m 644 deploy/cloud-https.conf /etc/nginx/sites-available/mycloud-https
ln -sf /etc/nginx/sites-available/mycloud-https /etc/nginx/sites-enabled/mycloud-https
sed -i \
  -e 's/^ALLOWED_HOSTS=.*/ALLOWED_HOSTS=localhost,127.0.0.1,cloud.mu56.ru/' \
  -e 's|^CORS_ALLOWED_ORIGINS=.*|CORS_ALLOWED_ORIGINS=https://mycloud.mu56.ru|' \
  -e 's|^CSRF_TRUSTED_ORIGINS=.*|CSRF_TRUSTED_ORIGINS=https://mycloud.mu56.ru|' \
  -e 's/^TRUST_PROXY=.*/TRUST_PROXY=True/' \
  -e 's/^COOKIE_SECURE=.*/COOKIE_SECURE=True/' \
  -e 's/^SECURE_SSL_REDIRECT=.*/SECURE_SSL_REDIRECT=True/' .env.deploy
docker compose --env-file .env.deploy up -d backend
nginx -t
systemctl reload nginx
