import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/n44ts/wbw3-events-dapp",
  cache: new InMemoryCache(),
});

export default client;