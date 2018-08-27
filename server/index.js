const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');
const { apolloUploadExpress } = require('apollo-upload-server');
const jwt = require('express-jwt');
const { createServer } = require('http');
const { createDatabase } = require('./database');
const { createSchema, createSubscritionServer } = require('./graphql');

const DEFAULT_PORT = 3001;
const DEFAULT_SECRET = 'totally-unguessable-jwt-secret';

const initApp = async ({ secret = DEFAULT_SECRET }) => {
    const app = express();
    const schema = await createSchema();
    const db = await createDatabase();
    app.use(
        '/graphql',
        cors({
            origin: 'http://localhost:3000'
        }),
        jwt({ secret, credentialsRequired: false }),
        bodyParser.json(),
        apolloUploadExpress(),
        graphqlExpress(({ user }) => ({ schema, context: { user, db } })),
    );
    return { app, schema };
};


const launchServer = async ({ port = DEFAULT_PORT, secret }) => {
    const { app, schema } = await initApp({ secret });
    const server = createServer(app);
    return new Promise((resolve, reject) =>
        server.listen(port, err => (err ? reject(err) : resolve({ port, server, schema }))));
};


if (module.parent) {
    module.exports = { createServer, launchServer };
} else {
    launchServer({ port: process.env.PORT, secret: process.env.SECRET }).then(
        /* eslint-disable no-console */
        ({ port, server, schema }) => {
            console.log(`Server listening on http://localhost:${port}`);
            console.log(` --> GraphQL endpoint: http://localhost:${port}/graphql`);

            createSubscritionServer(server, schema).then(() => {
                console.log(`Subscription Server Started on ws://localhost:5000/subscriptions`);
            });
        },
        error => console.error('Could not start server because', error),
        /* eslint-enable no-console */
    );
}
