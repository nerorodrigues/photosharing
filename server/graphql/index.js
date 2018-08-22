const glue = require('schemaglue');
const { makeExecutableSchema } = require('graphql-tools');
const schemaDirectives = require('./directives');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql')
const createSchema = async () => {
    const { schema, resolver } = glue('graphql/types');
    return makeExecutableSchema({
        typeDefs: schema,
        resolvers: resolver,
        schemaDirectives,
    });
};

const createSubscritionServer = async (ws) => {
    return new SubscriptionServer({
        execute,
        subscribe,
        schema: createSchema()
    }, {
            server: ws,
            path: '/subscriptions'
        });
}

module.exports = { createSchema, createSubscritionServer };


