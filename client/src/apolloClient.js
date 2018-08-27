import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';
import React from 'react';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { getMainDefinition } from "apollo-utilities";

const cache = new InMemoryCache({
    cacheRedirects: {
        Query: {
            Upload: (_, { id }, { getCacheKey }) => {
                getCacheKey({ __typename: 'upload', id });
            }
        }
    }
});


const wsLink = new SubscriptionClient('ws://localhost:3001/subscriptions', {
    reconnect: true,
});


const httpClient = createUploadLink({ uri: 'http://localhost:3001/graphql' });

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpClient
);

const apolloClient = new ApolloClient({
    link: link,
    /*ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            // if (graphQLErrors) {
            //     console.log(graphQLErrors); //sendToLoggingService(graphQLErrors);
            // }
            // if (networkError) {
            //     console.log(networkError); //logoutUser();
            // }
        }),
        link,
        withClientState({
            defaults: {
                isConnected: true
            },
            resolvers: {
                Mutation: {
                    updateNetworkStatus: (_, { isConnected }, { cache }) => {
                        cache.writeData({ data: { isConnected } });
                        return null;
                    }
                }
            },
            cache
        }),
    ]),*/
    cache
});

export const withApolloClient = App => (
    <ApolloProvider client={apolloClient}>
        <App />
    </ApolloProvider>
);

export default apolloClient;
