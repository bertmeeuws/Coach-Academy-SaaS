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
  console.log("Signup user: ", request);

  let user_id = request.data.insert_user_one.id;

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
    console.log("Sign up coach completed:", signUpCoach);
    console.log("Creating token");
    const token = generateJWT({
      defaultRole: "coach",
      allowedRoles: ["coach", "client"],
      otherClaims: {
        "x-hasura-client-id": String(user_id),
      },
    });
    console.log("Now returning token");
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
    console.log("Signup client completed:", signUpClient);
    console.log("Creating token");
    const token = generateJWT({
      defaultRole: "client",
      allowedRoles: ["client"],
      otherClaims: {
        "x-hasura-client-id": String(user_id),
      },
    });
    console.log("Now returning token");
    return res.json({ token });
  }
});

app.post("/api/actions/login", async (req, res) => {
  const client = req.body.input.user;
  console.log("Body received: " + client);
  const request = await sendQuery({
    query: `
    query FindClientByEmail($email: String!) {
      user(where: {email: {_eq: $email}}, limit: 1) {
        email
        password
        coach
        id
      }
    }`,
    variables: { email: client.email },
  });

  console.log("Request sent");
  const storedClient = request.data.user[0];
  if (!storedClient) return res.status(400).json({ error: "No client" });
  if (!storedClient) console.log("Client does not exist");
  const validPassword = bcrypt.compareSync(
    client.password,
    storedClient.password
  );
  if (!validPassword) return res.status(400).json({ error: "Invalid" });
  if (!validPassword) console.log("Passwords not matching");

  console.log("Let's check if it's a coach");
  if (storedClient.coach) {
    console.log("It's a coach");
    const token = generateJWT({
      defaultRole: "coach",
      allowedRoles: ["coach", "client"],
      otherClaims: {
        "x-hasura-client-id": String(storedClient.id),
      },
    });
    return res.json({ token });
  } else {
    console.log("It's a client");
    const token = generateJWT({
      defaultRole: "client",
      allowedRoles: ["client"],
      otherClaims: {
        "x-hasura-client-id": String(storedClient.id),
      },
    });
    return res.json({ token });
  }
});

app.post("/api/actions/getfood", async (req, res) => {
  const search = req.body.input.food;
  console.log(search);

  return res.json({ data: search });
});

// Bind to 0.0.0.0 host, so it'll work in Docker too
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
