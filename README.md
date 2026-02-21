# FILM!

## Установка

### MongoDB

Установите MongoDB скачав дистрибутив с официального сайта или с помощью пакетного менеджера вашей ОС. Также можно воспользоваться Docker (см. ветку `feat/docker`.

Выполните скрипт `test/mongodb_initial_stub.js` в консоли `mongo`.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `mongodb` 
* `DATABASE_URL` - адрес СУБД MongoDB, например `mongodb://127.0.0.1:27017/practicum`.  

MongoDB должна быть установлена и запущена.

Запустите бэкенд:

`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.





---

## Обновление для «Модульный API-сервис (часть 2)»

Текущая версия бэкенда поддерживает два драйвера БД и переключается через переменные окружения.

### Выбор БД

- `DATABASE_DRIVER="mongodb"` — запуск с MongoDB.
- `DATABASE_DRIVER="postgres"` — запуск с PostgreSQL.

### Переменные окружения (`backend/.env`)

Обязательные общие:

- `DATABASE_DRIVER`
- `CORS_ORIGINS` (например: `http://localhost:5173,http://localhost:5174`)

Для MongoDB:

- `DATABASE_URL` (например: `mongodb://localhost:27017/prac`)

Для PostgreSQL:

- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_NAME`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`

### SQL заготовки для PostgreSQL

Файлы находятся в `backend/test`:

- `prac.init.sql` — создание таблиц
- `prac.films.sql` — заполнение фильмами
- `prac.shedules.sql` — заполнение сеансами

### Быстрый запуск

Бэкенд:

```bash
cd backend
npm ci
npm run start:dev
```

Фронтенд:

```bash
cd frontend
npm ci
npm run dev
```

### Проверка API

- `GET /api/afisha/films`
- `GET /api/afisha/films/:id/schedule`
- `POST /api/afisha/order`
- `GET /content/afisha/*`

Если фронтенд запущен на другом порту, добавьте origin в `CORS_ORIGINS`.
