import React, {Fragment, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import agencies from './agency-id';

const Routes = (props) =>{
      const { params } = props.match;
      var usp = new URLSearchParams(props.location.search.substring(1))
      console.log(usp.entries())
      var id = agencies[params.agency][0];

      const [routes, setRoutes] = useState([]);

      const RouteShort = ({name}) =>{
        const bgcol = name.rc
        const col = name.rtc
        const styles = {backgroundColor: `#${bgcol}`, color:`#${col}`}
        const short = name.sn == "" ? name.ln : name.sn
        // console.log(short)
        var rstd = <h1 style={styles}>{short}</h1>

        return rstd;
      }

      const RouteLong = ({name}) =>{
        var show = name.sn === "" ?  "" : name.ln
        // console.log(`${name.sn} == ${name.ln}: ${name.sn == name.ln}`)
        return <p color='#000000'>{show}</p>
      }


      const getRoutes = async () => {
          try {
              
              const response = await fetch(`${process.env.REACT_APP_FETCH_URL||''}/routes?feed=${id}`); //in prod the environment variable should be ''
              console.log(process.env)
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
              <RouteShort name={{sn:route.route_short_name, ln:route.route_long_name, rc: route.route_color, rtc:route.route_text_color}}/>
            <RouteLong name={{sn:route.route_short_name, ln:route.route_long_name}}/>
              </a>
          </div>
          ))}
          
        </div>
      </div>)
  
    
  }

export default Routes