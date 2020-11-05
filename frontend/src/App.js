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
    <Route exact path="/login">
    <Login/>
    </Route>
    <Route exact path="/registerclient">
    <RegisterClient/>
    </Route>
    <Route exact path="/registercoach">
    <RegisterCoach/>
    </Route>
    <Route exact path="/dashboard">
    <Content />
    </Route>
    
    </BrowserRouter>
  );
}

export default App;
