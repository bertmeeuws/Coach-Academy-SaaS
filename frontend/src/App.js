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
import Header from './components/Header/'
import Sidebar from './components/Sidebar/'
import Dashboard from './content/coach/Dashboard'
import Clients from './content/coach/Clients'
import Todos from './content/coach/Todos'

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
      <div className="content-grid">
          <Sidebar/>
          <div className="container-grid">
          <Header title="Client"/>
          <Dashboard/>
          </div>
        </div>
    </Route>

    <Route exact path="/clients">
      <div className="content-grid">
          <Sidebar/>
          <div className="container-grid">
          <Header title="Clients"/>
          <Clients/>
          </div>
        </div>
    </Route>

    <Route exact path="/calendar">
      <div className="content-grid">
          <Sidebar/>
          <div className="container-grid">
          <Header title="Calendar"/>
          
          </div>
        </div>
    </Route>
    
    <Route exact path="/todos">
      <div className="content-grid">
          <Sidebar/>
          <div className="container-grid">
          <Header title="Todos"/>
          <Todos/>
          </div>
        </div>
    </Route>
    </BrowserRouter>
  );
}

export default App;
