import './App.css';
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import Login from "./content/authentication/Login"
import RegisterClient from "./content/authentication/RegisterClient"
import RegisterCoach from "./content/authentication/RegisterCoach"
import Content from './content/Content';

function App() {
  return (
    <BrowserRouter>
    <Switch>
    <Route path="/login">
    <Login/>
    </Route>
    <Route path="/registerclient">
    <RegisterClient/>
    </Route>
    <Route path="/registercoach">
    <RegisterCoach/>
    </Route>
    <Route path="/">
    <Content />
    </Route>
    </Switch>
    </BrowserRouter>
  );
}

export default App;
