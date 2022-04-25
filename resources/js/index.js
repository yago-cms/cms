window._ = require('lodash');

import { ApolloClient, ApolloProvider, from, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './components/App';

const uploadLink = createUploadLink({
    uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
    const token = JSON.parse(localStorage.getItem('accessToken'));

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ extensions }) => {
            // unset token reload window if authenticated
            if (extensions.category == 'authentication') {
                localStorage.removeItem('accessToken');
                location.reload();
            }
        });
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
    link: from([authLink, errorLink, uploadLink]),
    cache: new InMemoryCache()
});

ReactDOM.render(<ApolloProvider client={client}>
    <BrowserRouter basename="/admin">
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </BrowserRouter>
</ApolloProvider>,
    document.querySelector('#app'));