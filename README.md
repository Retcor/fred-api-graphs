# fred-api-graphs

This a base React / Node app that gathers data from the FRED APIs to display graphs and other pieces of data.
An additional piece of interaction with ChatGPT API. There might be other pieces to, just a learning app for learning
to deploy to kubernetes and whatever sounds fun!

## Local setup

Navigate to both /client and /server and run `npm i`. Then, run `npm start` in /server first and then in /client.

## docker-compose

Nginx is utilized to setup proxy servers to rewrite paths to the server to start as `/api`.

At the root of the project, use `docker-compose up --build` to run client and server together at http://localhost:3050/

The client will be ran with `npm docker` which sets the `REACT_APP_API_PREFIX` env variable to that `/api`

## ENV variables

Create a `.env` file in the server folder and place the following ENV variables:
1. API_KEY: This is the api key for Chat GPT API
2. PLAY_HT_AUTH: Auth token to Play.ht account
3. PLAY_HT_USER: User to Play.ht account

## Deploy

Initial deploy, `kubectl apply -f <yaml-filename>` for each file in ./deploy

For changes, build the image from either the server or client folder: `docker build -t gcr.io/<kubernetes-project-id>/<image-name>:<version> .`

Push the image up to Google Registry. This requires access to the kubernetes project and gcloud authorization as well as
docker config settings updated to communicate with that project: `docker push gcr.io/<kubernetes-project-id>/<image name>:<version>`

Update either the client or api deployment image file and then apply it to the cluster: `kubectl apply -f <deployment-yaml-filename>`
