import React, {Fragment, useEffect, useState} from 'react'
import agencies from './agency-id';

const Routes = (props) =>{
      const { params } = props.match;
      var id = agencies[params.agency];

      const [routes, setRoutes] = useState([]);

      const RouteShortTD = ({name}) =>{
        const bgcol = name.rc
        const col = name.rtc
        const style = {backgroundColor: bgcol, color:col}
        var rstd = <td style={style}>{name.sn}</td>

        return rstd;
      }

      const RouteLongTD = (name) =>{
        return <td>{name.name}</td>
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

      return(<Fragment>
        <h1>List Todos</h1>
        <table className="table mt-5 text-center">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {routes.map(route=> (
                    <tr key={route.route_id}>
                        <td></td>
                        <RouteShortTD name={{sn:route.route_short_name, rc: route.route_color, rtc:route.route_text_color}} />
                        <RouteLongTD name={route.route_long_name}/>
                        <td>Hi</td>
                        <td>high</td>
                    </tr>
                    ))}
            </tbody>
        </table></Fragment>
        );

    //render this
    
  }

export default Routes