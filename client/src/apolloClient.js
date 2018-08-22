import { ApolloClient } from 'apollo-client';//import { ApolloClient } from 'apollo-boost';
//import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { selectURI, selectHttpOptionsAndBody, fallbackHttpConfig, serializeFetchParameter, parseAndCheckHttpResponse, createSignalIfSupported } from 'apollo-link-http-common';
import { extractFiles } from 'extract-files'
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable, split } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';
import React, { AsyncStorage } from 'react';

import { WebSocketLink } from "apollo-link-ws";
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

export const createUploadLink = ({
    uri: fetchUri = '/graphql',
    fetch: linkFetch = fetch,
    fetchOptions,
    credentials,
    headers,
    includeExtensions
} = {}) => {
    const linkConfig = {
        http: { includeExtensions },
        options: fetchOptions,
        credentials,
        headers
    }
    console.log(fetchOptions);
    return new ApolloLink((operation, forward) => {
        const uri = selectURI(operation, fetchUri)
        const context = operation.getContext()
        const contextConfig = {
            http: context.http,
            options: context.fetchOptions,
            credentials: context.credentials,
            headers: context.headers
        };

        const { options, body } = selectHttpOptionsAndBody(
            operation,
            fallbackHttpConfig,
            linkConfig,
            contextConfig
        );

        const files = extractFiles(body)
        const payload = serializeFetchParameter(
            body,
            'Payload'
        )
        if (files.length) {
            // Automatically set by fetch when the body is a FormData instance.
            delete options.headers['content-type']

            // GraphQL multipart request spec:
            // https://github.com/jaydenseric/graphql-multipart-request-spec
            options.body = new FormData()
            options.body.append('operations', payload)
            options.body.append(
                'map',
                JSON.stringify(
                    files.reduce((map, { path }, index) => {
                        map[`${index}`] = [path]
                        return map
                    }, {})
                )
            )
            files.forEach(({ file }, index) =>
                options.body.append(index, file, file.name)
            )
        } else options.body = payload

        return new Observable(observer => {
            let handle;
            const {
                controller,
                signal
            } = createSignalIfSupported()
            if (controller) options.signal = signal
            linkFetch(uri, options)
                .then(response => {
                    // Forward the response on the context.
                    operation.setContext({ response })
                    return response
                })
                .then(parseAndCheckHttpResponse(operation))
                .then(result => {
                    observer.next(result)
                    observer.complete()
                })
                .catch(error => {
                    if (error.name === 'AbortError')
                        // Fetch was aborted.
                        return

                    if (error.result && error.result.errors && error.result.data)
                        // There is a GraphQL result to forward.
                        observer.next(error.result)
                    observer.error(error)
                })

            // Cleanup function.
            return () => {
                // Abort fetch.
                if (controller) controller.abort()
            }
        });
    });
}

const httpLink = new HttpLink({
    uri: 'http://localhost:3001/graphql',
})

const wslink = new WebSocketLink({
    uri: 'ws://localhost:3001/subscription',
    options: {
        reconnect: true
    }
});

const httpClient = createUploadLink({ uri: 'http://localhost:3001/graphql' });

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation == 'subscription';
    },
    httpClient,
    wslink
);


const apolloClient = new ApolloClient({
    link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                console.log(graphQLErrors); //sendToLoggingService(graphQLErrors);
            }
            if (networkError) {
                console.log(networkError); //logoutUser();
            }
        }),
        httpClient,
        withClientState({
            defaults: {
                isConnected: true
            },
            resolvers: {
                Mutation: {
                    updateNetworkStatus: (_, { isConnected }, { cache }) => {
                        cache.wrieData({ data: { isConnected } });
                        return null;
                    }
                }
            },
            cache
        }),
        httpClient
    ]),
    cache
});

export const withApolloClient = App => (
    <ApolloProvider client={apolloClient}>
        <App />
    </ApolloProvider>
);

export default apolloClient;