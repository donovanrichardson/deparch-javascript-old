import React, {Fragment, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import agencies from './agency-id';

const Dests = (props =>{
  const { params } = props.match;
  const usp = new URLSearchParams(props.location.search.substring(1))
  const route = usp.get("route")
  const origin = usp.get("origin")
  var id = agencies[params.agency][0];
//   console.log(route)

  const [dests, setDests] = useState([]);

  const getDests = async () => {
    try {
        
        const response = await fetch(`${process.env.REACT_APP_FETCH_URL||'https://deparch-js.herokuapp.com'}/dests?feed=${id}&route=${route}&origin=${origin}`);
        const jsonData = await response.json();
        setDests(jsonData);
        // console.log(jsonData)

    } catch (err) {
        console.error(err.message);
    }
}

useEffect(() => {
  getDests();
}, []);

// var todaydate = new Date()//in the future, maybe tie this with the feed's timezone
// var year = todaydate.getFullYear()
// var month = todaydate.getMonth() +1
// var day = todaydate.getDate()
// // &year=${year}&month=${month}&date=${day}

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
      </ul>
      <h1 style={{textAlign:"center"}} /* className="instructions" */>Choose Destination</h1>
<div className="container">
{dests.map(stop =>(
  <div className="card" key = {stop.stop_id}>
    <a href = {`tt?route=${route}&origin=${origin}&dest=${stop.stop_id}`}>
    <h2 color='#000000'>{stop.stop_name}</h2>
    </a>
</div>
))}

</div>
</div>)

})
  
export default Dests