# Whiteboard Server

This is a Nest.js server for the Whiteboard application.

## Description

This server provides API endpoints for the Whiteboard application.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Structure

```
src/
├── app.module.ts        # Main application module
├── main.ts              # Application entry point
├── config/              # Configuration files
├── controllers/         # Request handlers
├── dtos/                # Data transfer objects
├── filters/             # Exception filters
├── interfaces/          # TypeScript interfaces
├── middleware/          # HTTP middleware
├── models/              # Database models
├── modules/             # Feature modules
├── providers/           # Service providers
├── repositories/        # Data access layer
├── services/            # Business logic
└── utils/               # Utility functions
```

## License

[MIT](LICENSE)
