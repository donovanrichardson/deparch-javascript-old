import React, {Fragment, Component, useEffect, useState} from 'react'
import Calendar from 'react-calendar';
import {Link} from 'react-router-dom'
import agencies from './agency-id';

var selectedDate = new Date()
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//copy pasted from routes bc i couldn't figure out how to import it nicely
const RouteShort = ({name}) =>{
  const bgcol = name.rc
  const col = name.rtc
  const styles = {backgroundColor: `#${bgcol}`, color:`#${col}`}
  const short = name.sn == "" ? name.ln : name.sn
  // console.log(short)
  var rstd = <h1 style={styles}>{short}</h1>

  return rstd;
}

//modified from route version
const RouteLong = ({name}) =>{
  // console.log(`${name.sn} == ${name.ln}: ${name.sn == name.ln}`)
  return <p color='#000000'>{name}</p>
    }

const Timetable = (props) =>{
    const { params } = props.match;
    var id = agencies[params.agency][0];
    const usp = new URLSearchParams(props.location.search.substring(1))
    const route = usp.get("route")
    const origin = usp.get("origin")
    const dest = usp.get("dest")
    const today = new Date()
    const year = usp.get("year") || today.getFullYear()
    const month = usp.get('month') || today.getMonth() + 1
    const day = usp.get('date') || today.getDate()
    try{
        selectedDate= new Date(year, month -1, day)
        console.log(selectedDate)
    }catch(e){
        console.error(e)
    }

    const [routes, setRoutes] = useState({});
    const [date, getDate] = useState([]);


    const getRoutes = async () => {
        try {
            
            const query = `http://localhost:5000/tt?feed=${id}&route=${route}&origin=${origin}&dest=${dest}&year=${selectedDate.getFullYear()}&month=${selectedDate.getMonth() + 1}&date=${selectedDate.getDate()}`
            console.log(query)
            const response = await fetch(query);
            const jsonData = await response.json();
            const deps = jsonData.map(j =>(
              j.departure_time.split(':')
            ))
            console.log(jsonData)

            const early = parseInt(deps[0][0],10)
            const late = parseInt(deps[deps.length-1][0],10)
            var trav = 0
            var ttobj = {}

            for (var h = early; h <= late; h++){
              ttobj[h] = []
              while(trav < deps.length){
                if (deps[trav][0] == h){
                  ttobj[h].push(deps[trav])
                  trav ++
                } else break
              }
            }

            console.log(ttobj)
            setRoutes({route: jsonData[0], deps:ttobj});
            

        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
      getRoutes();
      console.log(`day:${day} month:${month} year:${year}`)
    }, []);

    var shaded = false;
    console.log(routes)
    if(routes.route){
      const bgcolor = ["#ffffff",`#${routes.route.route_color}`]
      const text = ["#000000",`#${routes.route.route_text_color}`]
      const first = Object.keys(routes.deps)[0]
      return(
        <div>
          <ul>
        <li>
          <Link to="/">Back to Agency Selection</Link>
        </li>
        <li>
          <Link to={`/${params.agency}/routes`}>Back to Route Selection</Link>
        </li>
        <li>
          <Link to={`/${params.agency}/stops?route=${route}`}>Back to Origin Selection</Link>
        </li>
        <li>
          <Link to={`/${params.agency}/stops?route=${route}&dest=${dest}`}>Back to Destination Selection</Link>
        </li>
      </ul>
          <div className="container">
          <table style={{textAlign: 'center'}}>
            <tbody>
          <tr><td colspan='2'>
          <div className="card" key = {routes.route.route_id}>
              <RouteShort name={{sn:routes.route.route_short_name, ln:routes.route.route_long_name, rc: routes.route.route_color, rtc:routes.route.route_text_color}}/>
              <RouteLong name={`Departures from ${routes.route.from} to ${routes.route.to}`}/>
            </div>
            </td></tr>
            <tr><td colspan='2'><p style={{textAlign: 'center'}}>{`${weekdays[selectedDate.getDay()]}, ${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`}</p></td></tr>
          {Object.keys(routes.deps).map(hour=>(
            <Fragment>
            <tr>
              <td className="hour" style={{backgroundColor: bgcolor[(hour-first)%2], color:text[(hour-first)%2]}}>{hour}</td>
              <td className="minute" style={{textAlign: 'left', backgroundColor: `${bgcolor[(hour-first)%2]}44`}}>{routes.deps[hour].map(minute=>(`${minute[1]} `))}</td>
            </tr>
            {shaded = !shaded}
            </Fragment>
      ))}
      </tbody>
          </table>
            {/* {routes['6'].map(route =>(
              <div className="card" key = 'i'>
                <a href = {`stops?route=i`}>
                    <h2>{route[0]}</h2>
                </a>
            </div>
            ))} */}
            
          </div>
          
          

          
        </div>)
    } else return null;

    

    

  
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