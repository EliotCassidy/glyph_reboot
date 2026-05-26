# NodeJS Server for Glyph

## Development Setup

To get started with local development, you will need to install the following:

1. [Docker](https://docs.docker.com/desktop/mac/install/)
2. [NVM](https://github.com/nvm-sh/nvm#install--update-script)

Navigate to the root of the backend directory and execute the following commands.

1. `nvm install`
2. `nvm use`

This will install NodeJS version 16 in your local environment and set it as the default version.

### install dependencies

Inside the backend folder run

```bash
$ yarn
```

This will fetch the required dependacies, and store them in a newly created folder called node_modules

### Start server

Navigate back to the root of the repository and run

```bash
$ docker compose up
```

This will start the API server on the port `5000`

### Local configurations

Add a file named `local.json` to the config directory
Copy the contents of `config/default.json` and fill in the null values with appropriate values of your choosing

Set `seedData` to true if you would like to seed the database with scripts data located in `src/db/data/scripts.json`
Generally you'd only want to do this when you setup for the first time.

Set `dropScripts` to true if you have existing scripts data in your database that you would like to remove before new data is uploaded.
You would want to do this if you make some changes to the data in `src/db/data/scripts.json` since the seeding function would skip over any scripts that's already in the database, using `isoNumber` as key

### Development Workflow

You will use docker to bring up and tear down the dev environment.
Check the [docker compose command reference](https://docs.docker.com/compose/reference/) for information on what commands you can run.

Here are the basic ones you would need:

1. `docker compose up` will build and start containers
2. `docker compose down` will stop and remove containers

You can start services in the background with

`docker compose up -d`

in which case you might want to run

`docker compose logs`

to tail the logs from the running services.

## API Requests

The API is mounted on `/api/v1` and so for local development, the base endpoint would be

`http://localhost:5000/api/v1`
