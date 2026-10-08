# My Cloud: Docker backend и GitHub Pages

Репозиторий: https://github.com/dm-morozov/my-cloud.
Backend: отдельный Compose-проект `mycloud` в `/srv/projects/mycloud`.
Frontend: GitHub Actions и GitHub Pages, workflow `.github/workflows/pages.yml`.

## Проверено 2026-10-08

- Backend, PostgreSQL и gateway запущены на VDS, порт только 127.0.0.1:18081.
- Все 34 backend-теста проходят в Docker с отдельной тестовой PostgreSQL.
- Миграции применены; собрано 157 статических файлов.
- CSRF endpoint отвечает 200, анонимный доступ к файлам 403, /media/ 404.
- Frontend собирается и lint проходит; сборка с параметрами Pages тоже проверена.
- mu56.ru продолжает отвечать HTTPS 200. Конфигурация его Nginx не изменялась.
- При финальной проверке доступно около 1 ГБ RAM и 16 ГБ диска.
- Публичные DNS/TLS и сквозная браузерная проверка frontend ещё не завершены.
- Старые пользовательские данные не переносились.

## Закрытый запуск

Скопировать `.env.deploy.example` в `.env.deploy`, задать случайные SECRET_KEY и
DB_PASSWORD. Этот файл не коммитить. Команды из каталога проекта:

```bash
docker compose --env-file .env.deploy build
docker compose --env-file .env.deploy up -d database
docker compose --env-file .env.deploy run --rm backend python manage.py migrate --noinput
docker compose --env-file .env.deploy run --rm backend python manage.py collectstatic --noinput
docker compose --env-file .env.deploy run --rm backend python manage.py test --noinput
docker compose --env-file .env.deploy up -d
```

Gateway слушает только `127.0.0.1:18081`. Подключение с компьютера:

```bash
ssh -L 18081:127.0.0.1:18081 root@161.104.32.37
```

Локальный frontend: VITE_API_BASE_URL=http://localhost:18081/api.
В CORS_ALLOWED_ORIGINS и CSRF_TRUSTED_ORIGINS добавить http://localhost:5173.
Mu56 использует другой Compose-проект и порт 18080.

## Публикация

Выбраны `cloud.mu56.ru` для API и `mycloud.mu56.ru` для frontend.
DNS mu56.ru обслуживается Beget. Требуемые записи:

| Имя | Тип | Значение |
| --- | --- | --- |
| cloud | A | 161.104.32.37 |
| mycloud | CNAME | dm-morozov.github.io |

На момент подготовки оба поддомена не разрешались. GitHub Pages уже настроен
на источник workflow. Для собственного frontend-домена VITE_BASE_PATH должен быть `/`.

Выбрать HTTPS-домен API. Серверный Nginx проксирует его на gateway,
перезаписывая Host и X-Forwarded-Proto. В .env.deploy задать ALLOWED_HOSTS,
точные frontend origins в CORS_ALLOWED_ORIGINS/CSRF_TRUSTED_ORIGINS,
TRUST_PROXY=True, COOKIE_SECURE=True, SECURE_SSL_REDIRECT=True.

Рекомендуются два поддомена одного домена: frontend с CNAME на GitHub Pages,
API с A-записью на VDS. Тогда COOKIE_SAMESITE=Lax.
При github.io и API на другом сайте потребуется COOKIE_SAMESITE=None;
браузер всё равно может блокировать сторонние cookies. Пока это не проверено,
публичная авторизация не считается работающей.

В GitHub Pages выбрать GitHub Actions. Repository variables:

- VITE_API_BASE_URL: HTTPS URL с суффиксом /api.
- VITE_BASE_PATH: /my-cloud/ для стандартного Pages URL; / для собственного домена.

Workflow не публикует сайт, пока URL API не задан. HashRouter обеспечивает
обновление страницы без server-side SPA fallback. API возвращает CSRF-токен JSON,
поскольку frontend не читает cookies API-домена.

## Данные

Volumes: mycloud_database, mycloud_media, mycloud_static.
Не выполнять `docker compose down -v`: это удалит данные.
Файл ограничен 20 MiB, квота пользователя 100 MiB.
Для публичного демо также нужны общий лимит хранения, ограничение регистрации
и rate limiting. Квота пользователя не ограничивает создание новых аккаунтов.
Старые данные не переносятся автоматически: нужны dump PostgreSQL и media.
Публичный административный демо-аккаунт не создавать.

## Ссылки

- Репозиторий: https://github.com/dm-morozov/my-cloud.
- Pages после публикации: https://dm-morozov.github.io/my-cloud/.
- Резюме: dm-morozov/resume-fullstack-py-js, README.md. Старый VPS URL заменить
  только после проверки нового публичного адреса; также проверить ссылку на репозиторий.
- После перемещения локальной папки обновить путь в IDE и приложении.

Имя Compose-проекта задано явно и не зависит от названия папки.
