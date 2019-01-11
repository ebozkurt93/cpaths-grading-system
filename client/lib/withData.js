import withApollo from 'next-with-apollo';
// import ApolloClient from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { endpoint } from '../config';

// function createClient({ headers }) {
//   return new ApolloClient({
//     uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
//     request: operation => {
//       operation.setContext({
//         fetchOptions: {
//           credentials: 'include'
//         },
//         headers
//       });
//     }
//   });
// }

function createClient(headers) {
  return new ApolloClient({
    ssrMode: false,
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      new createUploadLink({
        uri: endpoint,
        credentials: 'include'
      })
    ]),
    cache: new InMemoryCache(),
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include'
        },
        headers
      });
    },
    // Disabled caching for now, it breaks login process
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore'
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
      }
    }
  });
}
export default withApollo(createClient);
