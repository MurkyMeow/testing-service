import App from 'next/app';
import fetch from 'cross-fetch';
import ApolloClient from 'apollo-client';
import { Provider as ReduxProvider } from 'react-redux';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { createUploadLink } from 'apollo-upload-client';
import { Toast } from '../components/notification';
import { Header } from '../components/header';
import { store } from '../store';

const uri = process.env.production
  ? '/graphql'
  // in dev mode the frontend is served not on the same port as the server
  : 'http://localhost:4000/graphql';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({ uri, fetch, credentials: 'include' }),
});

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ReduxProvider store={store}>
        <ApolloProvider client={client}>
          <Toast />
          <Header />
          <Component {...pageProps} />
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        </ApolloProvider>
      </ReduxProvider>
    );
  }
}
