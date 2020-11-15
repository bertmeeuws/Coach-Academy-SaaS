import express from "express";
import fetch from "cross-fetch";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
const PORT = 3001;

const HASURA_ENDPOINT = "http://localhost:8085/v1/graphql";
const HASURA_ADMIN_SECRET = "my-secret";
// Don't actually do this, read this from process.env in a real app
const HASURA_GRAPHQL_JWT_SECRET =
  "XM9RnWahz+qrjSJjG/RNCMTR55AWhj0BKkru9Ksr/rY=";

// This is a function which takes the URL and headers for Hasura queries
// and returns a function which sends GraphQL requests to the Hasura instance
const makeGraphQLClient = ({ url, headers }) => async ({
  query,
  variables,
}) => {
  const request = await fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify({ query, variables }),
  });
  return request.json();
};

const sendQuery = makeGraphQLClient({
  url: HASURA_ENDPOINT,
  headers: {
    "X-Hasura-Admin-Secret": HASURA_ADMIN_SECRET,
  },
});

function generateJWT({ allowedRoles, defaultRole, otherClaims }) {
  const payload = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": allowedRoles,
      "x-hasura-default-role": defaultRole,
      ...otherClaims,
    },
  };
  return jwt.sign(payload, HASURA_GRAPHQL_JWT_SECRET, { algorithm: "HS256" });
}

/**
 * We will turn these REST API endpoints into Hasura Actions so that the client can call them through GraphQL queries within Hasura
 * https://hasura.io/docs/1.0/graphql/core/actions/action-handlers.html#http-handler
 *
 * To do this, we just need to define GraphQL types for:
 *  - The function's input arguments
 *  - The function's return type
 *
 * This can be done in the web console UI in Hasura, under the "Actions" tab
 */

app.post("/api/actions/signup", async (req, res) => {
  const data = req.body.input.user;
  console.log(data);

  data.password = bcrypt.hashSync(data.password);
  console.log(data.password);

  const {
    phone,
    weight,
    height,
    address,
    dob,
    name,
    city,
    postal,
    surname,
    profession,
    coach,
    email,
    password,
  } = data;

  const user = { email, password, coach };

  const request = await sendQuery({
    query: `
        mutation InsertUser($user: user_insert_input!){
            insert_user_one(object: $user) {
              id
              
            }
          }`,
    variables: { user },
  });

  if (request.errors) return res.status(400).json({ errors: request.errors });
  console.log("Signup user:", request);

  if (coach) {
    //coach true
    //insert into coach table

    const coachData = {
      email,
      surname,
      name,
      user_id: request.data.insert_user_one.id,
    };

    const signUpCoach = await sendQuery({
      query: `
      mutation InsertCoach($coachData: coach_insert_input!) {
        insert_coach_one(object: $coachData){
          id
        }
      }`,
      variables: { coachData },
    });

    if (signUpCoach.errors)
      return res.status(400).json({ errors: signUpCoach.errors });
    console.log("Sign up coach:", signUpCoach);

    const token = generateJWT({
      defaultRole: "coach",
      allowedRoles: ["coach", "client"],
      otherClaims: {
        "x-hasura-client-id": signUpCoach.data.insert_coach_one.id,
      },
    });

    return res.json({ token });
  } else {
    //insert into client table

    const clientData = {
      phone,
      weight,
      height,
      address,
      dob,
      name,
      city,
      postal,
      surname,
      profession,
      email,
      user_id: request.data.insert_user_one.id,
    };

    const signUpClient = await sendQuery({
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

    if (signUpClient.errors)
      return res.status(400).json({ errors: signUpClient.errors });
    console.log("Signup client:", signUpClient);

    const token = generateJWT({
      defaultRole: "client",
      allowedRoles: ["client"],
      otherClaims: {
        "x-hasura-client-id": signUpClient.data.insert_client_one.id,
      },
    });

    return res.json({ token });
  }
});

app.post("/api/actions/client-login", async (req, res) => {
  const client = req.body.input.client;
  const request = await sendQuery({
    query: `
      query FindClientByEmail($email: String!){
          client(where: { email: { _eq: $email } }, limit: 1) {
            id
            password
          }
        }`,
    variables: { email: client.email },
  });

  const storedClient = request.client[0];
  if (!storedClient) return res.status(400).json({ error: "No client" });

  const validPassword = bcrypt.compareSync(
    client.password,
    storedClient.password
  );
  if (!validPassword) return res.status(400).json({ error: "Invalid" });

  const token = generateJWT({
    defaultRole: "client",
    allowedRoles: ["client"],
    otherClaims: {
      "x-hasura-client-id": storedClient.id,
    },
  });
  return res.json({ token });
});

app.post("/api/actions/coach-login", async (req, res) => {
  const coach = req.body.input;
  const request = await sendQuery({
    query: `
      query FindCoachByEmail($email: String!){
        coach(where: { email: { _eq: $email } }, limit: 1) {
            id
            password
          }
        }`,
    variables: { email: coach.email },
  });

  const storedCoach = request.coach[0];
  if (!storedCoach) return res.status(400).json({ error: "No client" });

  const validPassword = bcrypt.compareSync(
    coach.password,
    storedCoach.password
  );
  if (!validPassword) return res.status(400).json({ error: "Invalid" });

  const token = generateJWT({
    defaultRole: "coach",
    allowedRoles: ["coach", "client"],
    otherClaims: {
      "x-hasura-coach-id": storedCoach.id,
    },
  });
  return res.json({ token });
});

// Bind to 0.0.0.0 host, so it'll work in Docker too
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
