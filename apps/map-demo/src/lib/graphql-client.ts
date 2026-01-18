import { GraphQLClient } from "graphql-request";

// Get GAPI URL from environment variable
const GAPI_URL = process.env.GAPI_URL || "http://localhost:8080/query";

export const graphqlClient = new GraphQLClient(GAPI_URL, {
  headers: {
    "Content-Type": "application/json",
  },
});
