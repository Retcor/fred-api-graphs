# fred-api-graphs

This a base React / Node app that gathers data from the FRED APIs to display graphs and other pieces of data

## Local setup

Navigate to both /client and /server and run `npm i`. Then, run `npm start` in /server first and then in /client.

## docker-compose

Nginx is utilized to setup proxy servers to rewrite paths to the server to start as `/api`.

At the root of the project, use `docker-compose up --build` to run client and server together at http://localhost:3050/

The client will be ran with `npm docker` which sets the `REACT_APP_API_PREFIX` env variable to that `/api`
