import React, {Fragment, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import agencies from './agency-id';

const Stops = (props =>{
  const { params } = props.match;
  const usp = new URLSearchParams(props.location.search.substring(1))
  const route = usp.get("route")
  var id = agencies[params.agency][0];
  console.log(route)

  const [stops, setStops] = useState([]);

  const getStops = async () => {
    try {
        
        const response = await fetch(`http://localhost:5000/stops?feed=${id}&route=${route}`);
        const jsonData = await response.json();
        setStops(jsonData);
        console.log(jsonData)

    } catch (err) {
        console.error(err.message);
    }
}

useEffect(() => {
  getStops();
}, []);

return(
<div>
        <ul>
        <li>
          <Link to="/">Back to Agency Selection</Link>
        </li>
        <li>
          <Link to={`/${params.agency}/routes`}>Back to Route Selection</Link>
        </li>
      </ul>
      <div className="container">
{stops.map(stop =>(
  <div className="card" key = {stop.stop_id}>
    <a href = {`dests?route=${route}&origin=${stop.stop_id}`}>
    <h2 color='#000000'>{stop.stop_name}</h2>
    </a>
</div>
))}

</div>
</div>)

})
  
export default Stops