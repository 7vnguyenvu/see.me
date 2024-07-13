import { ApolloClient, InMemoryCache } from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

// import { WebSocketLink } from "apollo-link-ws";
// import { getMainDefinition } from "@apollo/client/utilities";

// const API_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_API_GRAPHQL_ENDPOINT;
// const API_SUBSCRIPTION_ENDPOINT = process.env.NEXT_PUBLIC_API_SUBSCRIPTION_ENDPOINT;

// const wsLink = new WebSocketLink({
//     uri: API_SUBSCRIPTION_ENDPOINT,
//     options: {
//         reconnect: true,
//     },
// });

// const httpLink = new HttpLink({
//     uri: API_GRAPHQL_ENDPOINT,
// });

const authLink = setContext((_, { headers }) => {
    const type = localStorage.getItem("act");
    const token = localStorage.getItem("access-token");

    return {
        headers: {
            ...headers,
            "access-token-type": token ? (type === 1 ? `user` : "enterprise") : "",
            "access-token": token ? `Bearer ${token}` : "",
        },
    };
});

// const splitLink = split(
//     ({ query }) => {
//         const definition = getMainDefinition(query);
//         return definition.kind === "OperationDefinition" && definition.operation === "subscription";
//     }
//     wsLink,
//     httpLink
// );

const client = new ApolloClient({
    link: authLink,
    // link: authLink.concat(splitLink),
    cache: new InMemoryCache(),
    credentials: "include",
});

export default client;
