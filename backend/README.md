## How to run the project

To work with the back end project please go to the /backend folder in your terminal

```bash
cd backend
```

### Install Dependencies

```bash
npm install
```

### Run database instance

Make sure you have docker installed on your machine

```bash
npm run docker-up
```

To run the backend api, you need to create `.env` folder in the root of project, use `.env.example` as reference and fill actual values.

### Run the backend api

```bash
npm run api-dev
```

### Files Structure

`/docker` - includes docker configuration files for database and might have deployment scripts as well

`/config` - includes config files. `index.ts` - config variables object parsed from `.env`

`/database` - includes `entities` and `data-source.ts`

`/modules` - includes high level modules that could be libraries and not related to special project

`/routes` - includes routes separated into different files

`/middlewares` - includes express middlewares

`index.ts` - the entry point, creates server, database connection, injects app level middlewares, routes
