const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

export function generateJWT({ allowedRoles, defaultRole, otherClaims }) {
  const payload = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": allowedRoles,
      "x-hasura-default-role": defaultRole,
      ...otherClaims,
    },
  };

  if (!process.env.HASURA_GRAPHQL_JWT_SECRET)
    throw new Error(
      "No JWT secret found, please set HASURA_GRAPHQL_JWT_SECRET"
    );

  return jwt.sign(payload, process.env.HASURA_GRAPHQL_JWT_SECRET, {
    algorithm: "HS256",
  });
}

// This is a function which takes the URL and headers for Hasura queries
// and returns a function which sends GraphQL requests to the Hasura instance
const makeGraphQLClient = ({ url, headers }) => async ({
  query,
  variables,
}) => {
  const payload = JSON.stringify({ query, variables });
  const req = await axios.post(url, payload, { headers });
  return req.data;
};

export const sendQuery = makeGraphQLClient({
  url: process.env.HASURA_ENDPOINT,
  headers: {
    "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET,
  },
});

export async function insertUser(user) {
  user.password = bcrypt.hashSync(user.password);
  const result = await sendQuery({
    query: `
        mutation InsertUser($user: user_insert_input!){
            insert_user_one(object: $user) {
              id
            }
          }`,
    variables: { user },
  });
  return result;
}

export async function handleClientSignup(clientData) {
  return sendQuery({
    query: `
    mutation InsertClient($clientData: client_insert_input!) {
      insert_client_one(object: $clientData){
        id
        surname
        name
      }
    }`,
    variables: { clientData },
  });
}

export async function handleCoachSignup(user) {
  return sendQuery({
    query: `
    mutation InsertCoach($coachData: coach_insert_input!) {
      insert_coach_one(object: $coachData){
        id
      }
    }`,
    variables: { user },
  });
}
