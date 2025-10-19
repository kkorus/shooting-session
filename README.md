# Shooting Session API


## Quick Start

```bash
# 1. setup environment
cp env.example .env

# 2. install packages
npm install

# 3. start with Docker
docker-compose up

# 4. seed database and generate token
npm run seed:users
npm run mint:token
```

The API will be available at `http://localhost:3001`

## Testing Endpoints

Use `requests.http` file with [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension.

Update the `@token` variable with the token from `npm run mint:token`, then click "Send Request" on any endpoint.

## What's Running

- **API**: http://localhost:3001
- **Database**: PostgreSQL on localhost:5432
- **Adminer** (DB UI): http://localhost:8080

## Run tests
- `npm run test`
- `npm run test:integration`
