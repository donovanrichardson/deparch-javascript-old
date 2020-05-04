import React, {Fragment, Component, useEffect, useState} from 'react'
import Calendar from 'react-calendar';
import {Link} from 'react-router-dom'
import agencies from './agency-id';

var selectedDate = new Date()

const Timetable = (props) =>{
    const { params } = props.match;
    var id = agencies[params.agency][0];
    const usp = new URLSearchParams(props.location.search.substring(1))
    const route = usp.get("route")
    const origin = usp.get("origin")
    const dest = usp.get("dest")
    const year = usp.get("year")
    const month = usp.get('month')
    const day = usp.get('date')
    try{
        selectedDate= new Date(year, month -1, day)
        console.log(selectedDate)
    }catch(e){
        console.error(e)
    }

    const [routes, setRoutes] = useState([]);


    const getRoutes = async () => {
        try {
            
            const query = `http://localhost:5000/tt?feed=${id}&route=${route}&origin=${origin}&dest=${dest}&year=${selectedDate.getFullYear()}&month=${selectedDate.getMonth() + 1}&date=${selectedDate.getDate()}`
            console.log(query)
            const response = await fetch(query);
            const jsonData = await response.json();
            setRoutes(jsonData);
            console.log(jsonData)

        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
      getRoutes();
    }, []);

    return(
    <div>
      <ul>
      <li>
        <Link to="/">Back to Agency Selection</Link>
      </li>
    </ul>
      <div className="container">
        {routes.map(route =>(
          <div className="card" key = {route.route_id}>
            <a href = {`stops?route=${route.route_id}`}>
                <h2>{route.departure_time}</h2>
            </a>
        </div>
        ))}
        
      </div>
    </div>)

  
}
// export default
 class calen extends Component {
  state = {
    value: new Date(),
  }

  onChange = value => {
      this.setState({ value })
      console.log(value)
    }

  render() {
    const { value } = this.state;

    return (
      <Calendar calendarType="US"
        onChange={this.onChange}
        value={value}
      />
    );
  }
}

class Cal extends Component {
    state = {
      value: new Date(),
    }
  
    onChange = value => this.setState({ value })
  
    render() {
      const { value } = this.state;
  
      return (
        <Calendar calendarType="US"
          onChange={this.onChange}
          value={value}
        />
      );
    }
  }

  export default Timetable