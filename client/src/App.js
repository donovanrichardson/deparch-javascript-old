import React, {Fragment} from 'react';
import logo from './logo.svg';
import './App.css';
import 'react-calendar/dist/Calendar.css';
import agencies from './component/agency-id'

class App extends React.Component {
  render() {
    // console.log(agencies)
    return (<div className="container">
            {Object.keys(agencies).map(a =>(
              <div className="card" key = {agencies[a][0]}>
                <a href = {`${a}/routes`}>
                  <h1>{agencies[a][1]}</h1>
                </a>
            </div>))}
            </div>)
  
  }
}

export default App;
