import React, {Fragment, useEffect, useState} from 'react'
import agencies from './agency-id';

const Routes = (props) =>{
      const { params } = props.match;
      var id = agencies[params.agency];

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
        console.log(`${name.sn} == ${name.ln}: ${name.sn == name.ln}`)
        return <p>{show}</p>
      }


      const getRoutes = async () => {
          try {
              
              const response = await fetch(`http://localhost:5000/routes?feed=${id}`);
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

      return(<div className="container">
        {routes.map(route =>(
          <div className="card" key = {route.route_id}>
          <RouteShort name={{sn:route.route_short_name, ln:route.route_long_name, rc: route.route_color, rtc:route.route_text_color}}/>
          <RouteLong name={{sn:route.route_short_name, ln:route.route_long_name}}/>
        </div>
        ))}
        
      </div>)
    //     <div className="container">
    //     <div className="card">
    //         <RouteShort name={{sn:route.route_short_name, rc: route.route_color, rtc:route.route_text_color}}/> {/*<!-- is an h1-->*/}
    //         <RouteLong name={route.route_long_name}/> {/* <!-- is a p--> */}
    //     </div>
    // </div>);
      // <Fragment>
      //   <h1>List Todos</h1>
      //   <table className="table mt-5 text-center">
      //       <thead>
      //           <tr>
      //               <th>Name</th>
      //               <th>Description</th>
      //               <th></th>
      //               <th></th>
      //           </tr>
      //       </thead>
      //       <tbody>
      //           {routes.map(route=> (
      //               <tr key={route.route_id}>
      //                   <td></td>
      //                   <RouteShortTD name={{sn:route.route_short_name, rc: route.route_color, rtc:route.route_text_color}} />
      //                   <RouteLongTD name={route.route_long_name}/>
      //                   <td>Hi</td>
      //                   <td>high</td>
      //               </tr>
      //               ))}
      //       </tbody>
      //   </table></Fragment>
        // );

    //render this
    
  }

export default Routes