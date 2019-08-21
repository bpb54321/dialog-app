# Dialog Practice
* An app that allows you to practice foreign language dialogs, or lines in a play!
* This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
* The backend is a GraphQL API using graphql-yoga package in NodeJS. Boostrapped from Howto GraphQL.

## Running Local Development Prisma and MySQL Servers with Docker
```
# Build and start containers for the Prisma and MySQL services
docker-compose up -d

# List all docker containers (will list container names and ids)
docker container ls

# SSH into a running container and execute a command
docker exec <container name> <command>

# Open an interactive bash terminal in a running container
docker exec -it <container name> /bin/bash

```
