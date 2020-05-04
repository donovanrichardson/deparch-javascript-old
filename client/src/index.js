import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import './index.css';
import App from './App';
import Routes from './component/routes'
import Stops from './component/stops'
import Dests from './component/dests'
import Timetable from './component/timetable'
import Notfound from './component/notfound'
import * as serviceWorker from './serviceWorker';

const routing = (
  <Router>
    {/* <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul> */}
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/:agency/routes" component={Routes} />
         <Route path="/:agency/stops" component={Stops} />
        <Route path="/:agency/dests" component={Dests} />
        <Route path="/:agency/tt" component={Timetable} />
        <Route component={Notfound} />
      </Switch>
    {/* </div> */}
  </Router>
)

ReactDOM.render(
  routing, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
