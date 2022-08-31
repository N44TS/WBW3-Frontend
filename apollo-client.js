import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/snackalie/anotherwbw3rsvp",
  cache: new InMemoryCache(),
});

export default client;