
# Project Setup

## 1. Start Docker Services

Start services with Docker:
```bash
docker compose up -d
```
⚠ Warning: Docker may occasionally encounter issues depending on the system it is running on. If you experience errors when starting the docker-compose file, please try running the command again.

## 2. Nginx

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
