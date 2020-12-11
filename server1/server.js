const { google } = require("googleapis");
const { PreciseDate } = require("@google-cloud/precise-date");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const queryParse = require("query-string");
const routeList = require("express-routes-catalogue");
const storage = require("./storage");
const urlParse = require("url-parse");

const {
  sendQuery,
  generateJWT,
  handleClientSignup,
  handleCoachSignup,
  insertUser,
} = require("./utils");

const app = express();
const corsMiddleware = cors({ credentials: true, origin: true });
app.use(corsMiddleware);
app.use(morgan("tiny"));
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/storage", storage);

app.post("/api/actions/signup", async (req, res) => {
  const user = req.body.input.user;

  const insertUserResult = await insertUser({ user });
  if (insertUserResult.errors)
    return res.status(400).json({ errors: insertUserResult.errors });

  console.log("Signup user: ", insertUserResult);
  const user_id = insertUserResult.data.insert_user_one.id;

  if (user.coach) {
    const result = await handleCoachSignup({ ...user, user_id });
    if (result.errors) return res.status(400).json({ errors: result.errors });

    console.log("Sign up coach completed:", result);
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
    const result = await handleClientSignup({ ...user, user_id });
    if (result.errors) return res.status(400).json({ errors: result.errors });

    console.log("Signup client completed:", result);
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
    "nothing to see here",
    "nothing to see here",
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
  console.log("Call back received with id: " + id);

  const oauth2Client = new google.auth.OAuth2(
    "nothing to see here",
    "nothing to see here",
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
    const datasetURL =
      "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";

    const payload = {
      aggregateBy: [
        {
          dataTypeName: "com.google.weight.summary",
          dataSourceId:
            "derived:com.google.weight:com.google.android.gms:merge_weight",
        },
      ],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: test.getTime(),
    };

    const headers = {
      authorization: "Bearer " + tokens.tokens.access_token,
    };

    const weightResult = await axios.post(datasetURL, payload, { headers });
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

          console.log("Weight injected into DB");
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

          console.log(steps);

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

          console.log("Steps injected into database");
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

routeList.terminal(app);

if (!process.env.PORT) throw new Error("No env value for PORT set");
// Bind to 0.0.0.0 host, so it'll work in Docker too
app.listen(Number(process.env.PORT), "0.0.0.0", () => {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});
