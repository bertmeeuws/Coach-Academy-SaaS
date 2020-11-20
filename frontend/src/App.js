import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/link-ws";
import Login from "./content/authentication/Login";
import RegisterClient from "./content/authentication/RegisterClient";
import RegisterCoach from "./content/authentication/RegisterCoach";
import Header from "./components/Header/";
import Sidebar from "./components/Sidebar/";
import Dashboard from "./content/coach/Dashboard";
import Clients from "./content/coach/Clients";
import Todos from "./content/coach/Todos";
import Calendar from "./content/Calendar";
import Inbox from "./content/Inbox";
import Chat from "./content/Chat";
import Documents from "./content/Documents";
import AuthenticatedView from "./components/AuthenticatedView/index";
import Client from "./content/coach/Client";
import ClientDashboard from "./content/client/dashboard";
import { StoreProvider, useStoreState } from "easy-peasy";
import { store } from "./store";

const GRAPHQL_ENDPOINT = "localhost:8085/v1/graphql";

const getHeaders = () => {
  const headers = {};
  const token = store.getState().apollotoken;
  console.log("App.js: this is the token " + String(token));
  if (token !== undefined) {
    headers.authorization = `Bearer ${String(token)}`;
    console.log("Token used in headers");
  } else {
    headers["X-Hasura-Admin-Secret"] = "my-secret";
    console.log("Admin secret used in headers");
  }
  return headers;
};

const httpLink = new HttpLink({
  uri: `http://${GRAPHQL_ENDPOINT}`,
  headers: getHeaders(),
});

const wsLink = new WebSocketLink({
  uri: `ws://${GRAPHQL_ENDPOINT}`,
  options: {
    reconnect: true,
    timeout: 30000,
    connectionParams: () => {
      return { headers: getHeaders() };
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache({ addTypename: true }),
  link: splitLink,
});

function App() {
  return (
    <BrowserRouter>
      <StoreProvider store={store}>
        <ApolloProvider client={client}>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/registerclient">
            <RegisterClient />
          </Route>
          <Route exact path="/registercoach">
            <RegisterCoach />
          </Route>

          <Route exact path="/dashboard">
            <AuthenticatedView roles={["coach"]}>
              <div className="content-grid">
                <Sidebar />
                <div className="container-grid">
                  <Header title="Client" />
                  <Dashboard />
                </div>
              </div>
            </AuthenticatedView>
          </Route>

          <Route exact path="/clients">
            <AuthenticatedView roles={["coach"]}>
              <div className="content-grid">
                <Sidebar />
                <div className="container-grid">
                  <Header title="Clients" />
                  <Clients />
                </div>
              </div>
            </AuthenticatedView>
          </Route>

          <Route exact path="/calendar">
            <div className="content-grid">
              <Sidebar />
              <div className="container-grid">
                <Header title="Calendar" />
                <Calendar />
              </div>
            </div>
          </Route>

          <Route exact path="/client">
            <AuthenticatedView roles={["coach"]}>
              <div className="content-grid">
                <Sidebar />
                <div className="container-grid">
                  <Header title="Client overview" />
                  <Client />
                </div>
              </div>
            </AuthenticatedView>
          </Route>

          <Route exact path="/clientdashboard">
            <AuthenticatedView roles={["client"]}>
              <ClientDashboard />
            </AuthenticatedView>
          </Route>

          <Route exact path="/todos">
            <div className="content-grid">
              <Sidebar />
              <div className="container-grid">
                <Header title="Todos" />
                <Todos />
              </div>
            </div>
          </Route>
        </ApolloProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
