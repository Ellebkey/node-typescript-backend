# Ellebkey Backend Node.js Project

Personal backend project. Just for portafolio.

## Features
- Node.js
- Typescript
- Express
- PostgreSQL
- MongoDB

## Installation
It requires that you have PostgreSQL and MongoDB running on your local machine. This app requires [Node.js](https://nodejs.org/) v14+ to run.

Install dependencies:
```sh
npm install
```

Install global dependencies:
```sh
npm install -g ts-node typescript gulp
```

Set environment (vars):
Copy  `.env.example` and rename it as `.env`. Change the info with you local database.

Start server (development):
```sh
# Start server
gulp default
```

Lint:
```sh
# Lint code with ESLint
gulp tslint
```

## Files Structure
- src
  - config
  - controllers
  - middlewares
  - models
  - routes
  - validations
  - utils
- tests

## Development

Always make a branch out `develop` and raise a PR to be approved.


