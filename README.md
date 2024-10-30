
# Project Setup

## 1. Run Migrations

Generate and run migrations:
```bash
npm run typeorm:generate
npm run typeorm:run
```

## 2. Start Docker Services

Start services with Docker:
```bash
docker compose up -d
```

## 3. Nginx

The application is accessible through Nginx on port 90.

## API Endpoints

### Register User
**POST** `/auth/register`

#### Request Body:
```json
{
    "username": "name",
    "password": "12345"
}
```

### Login
**POST** `/auth/login`

#### Request Body:
```json
{
    "username": "name",
    "password": "12345"
}
```

### Get Currency Data
**GET** `/currency`

- Requires Bearer token for authorization.
