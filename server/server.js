import express from "express";
import fetch from "cross-fetch";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { google } = require("googleapis");
const request = require("request");
const cors = require("cors");
const urlParse = require("url-parse");
const queryParse = require("query-string");
const axios = require("axios");
const { PreciseDate } = require("@google-cloud/precise-date");

//const { google } = require("googleapis");
//import google from "googleapis";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 3001;

//const google = google;

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
      allowedRoles: ["coach"],
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
      allowedRoles: ["coach"],
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
  const id = req.body.input.id.id;
  console.log(req.body);
  const oauth2Client = new google.auth.OAuth2(
    "625672102570-t557djk99mu5emcutn8ks33gcohnmgon.apps.googleusercontent.com",
    "y6hIEBLpM-zdJzDNy4ZmUs-S",
    "http://localhost:3001/api/actions/callback/"
  );

  const scopes = [
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.body.read",
    "https://www.googleapis.com/auth/fitness.reproductive_health.read",
  ];

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",

    // If you only need one scope you can pass it as a string
    scope: scopes,
  });

  //id inparsen

  console.log(url + "&state=JEWEETZELF");

  const redirect = url + "&state=" + id;
  //console.log(url);

  //const fit = google.fitness("v1");

  return res.json({ url: redirect });
});

app.get("/api/actions/callback/", async (req, res) => {
  const queryURL = new urlParse(req.url);
  const code = queryParse.parse(queryURL.query).code;
  const state = queryParse.parse(queryURL.query);
  console.log(state.state);
  const id = state.state;
  //console.log(req.params);

  const oauth2Client = new google.auth.OAuth2(
    "625672102570-t557djk99mu5emcutn8ks33gcohnmgon.apps.googleusercontent.com",
    "y6hIEBLpM-zdJzDNy4ZmUs-S",
    "http://localhost:3001/api/actions/callback/"
  );

  console.log("This is the code: " + code);

  const tokens = await oauth2Client.getToken(code);
  //oauth2Client.setCredentials(tokens);
  //console.log(tokens);
  //res.send(req.params);

  //res.send("You are authenticated");
  res.redirect("http://localhost:3002/clientdashboard");
  console.log("Acces token: " + tokens.tokens.access_token);
  let stepArray = [];

  var previous = new Date();
  previous.setDate(previous.getDate() - 3);
  previous.setUTCHours(0, 0, 0, 0);

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  tomorrow.setUTCHours(0, 0, 0, 0);

  var test = new Date();
  test.setDate(test.getDate() + -1);
  test.setUTCHours(0, 0, 0, 0);

  var test1 = new Date();
  test1.setDate(test1.getDate() + 2);
  test1.setUTCHours(0, 0, 0, 0);

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  //console.log(previous.getTime());
  //console.log(tomorrow.getTime());

  let weightArray = [];

  try {
    const weightResult = await axios({
      method: "POST",
      headers: {
        authorization: "Bearer " + tokens.tokens.access_token,
      },
      "Content-Type": "application/json",
      url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      data: {
        aggregateBy: [
          {
            dataTypeName: "com.google.weight.summary",
            dataSourceId:
              "derived:com.google.weight:com.google.android.gms:merge_weight",
          },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: test.getTime(),
        endTimeMillis: test1.getTime(),
      },
    });
    //console.log(result.data.bucket);
    weightArray = weightResult.data.bucket;
    //console.log(weightArray);
  } catch (e) {
    console.log(e);
  }

  const getDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    return (today = yyyy + "-" + mm + "-" + dd);
  };

  try {
    for (const dataSet of weightArray) {
      for (const points of dataSet.dataset) {
        for (const steps of points.point) {
          console.log(steps);

          const start = steps.startTimeNanos;
          const end = steps.endTimeNanos;

          //(start);
          //const dateEnd = new PreciseDate(end);
          //console.log(formatDate(dateStart.toISOString()));
          //console.log(formatDate(dateEnd.toISOString()));

          const addToDatabase = await sendQuery({
            query: `
          mutation MyMutation($object: weight_insert_input!) {
            insert_weight_one(object: $object) {
              id
              
            }
          }
          `,
            variables: {
              object: {
                weight:
                  Math.round(steps.value[1].fpVal * 100 + Number.EPSILON) / 100,
                date: new Date(),
                user_id: id,
              },
            },
          });

          if (addToDatabase.errors)
            return res.status(400).json({ errors: addToDatabase.errors });
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  try {
    const result = await axios({
      method: "POST",
      headers: {
        authorization: "Bearer " + tokens.tokens.access_token,
      },
      "Content-Type": "application/json",
      url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      data: {
        aggregateBy: [
          {
            dateTypeName: "com.google.step_count.delta",
            dataSourceId:
              "derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas",
          },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: previous.getTime(),
        endTimeMillis: tomorrow.getTime(),
      },
    });
    //console.log(result.data.bucket);
    stepArray = result.data.bucket;
  } catch (e) {
    //console.log(e);
  }

  try {
    let array = [];

    for (const dataSet of stepArray) {
      for (const points of dataSet.dataset) {
        for (const steps of points.point) {
          //console.log(steps);
          const start = steps.startTimeNanos;
          const end = steps.endTimeNanos;

          const dateStart = new PreciseDate(start);
          const dateEnd = new PreciseDate(end);

          //console.log(start.isValid());

          const addToDatabase = await sendQuery({
            query: `
            mutation MyMutation($object: steps_insert_input!) {
              insert_steps_one(object: $object) {
                id
                updated_at
                steps
                date
              }
            }
            `,
            variables: {
              object: {
                steps: steps.value[0].intVal,
                date: formatDate(dateStart.toISOString()),
                user_id: id,
              },
            },
          });

          if (addToDatabase.errors)
            return res.status(400).json({ errors: addToDatabase.errors });

          //console.log();
          array.push({
            start: formatDate(dateStart.toISOString()),
            end: formatDate(dateEnd.toISOString()),
            steps: steps.value[0].intVal,
          });
        }
      }
    }

    //Write to Database
  } catch (e) {
    console.log(e);
  }

  //return res.json({ data: "yes" });
});

// Bind to 0.0.0.0 host, so it'll work in Docker too
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
