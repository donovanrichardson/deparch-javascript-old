# Deparch JS 

A Node.js project for retrieving scheduled departure times for transit using GTFS. This is the same thing that [my earlier Deparch project](https://donovanrichardson.github.io/departures/home.html) does, but with a simplified codebase.

Right now it is just a back end; soon I will create a front end that will generate timetables with this API.

Currently this API supports four agencies:

- **mbta/64** Boston MBTA
- **mta/86** Long Island Rail Road
- **mta/79** New York City Subway
- **sfmta/60** San Francisco Muni Metro

This API uses GTFS data stored in a PostgreSQL database. Database import is not automated, so support for the agencies is based totally on which I decide to upload and maintain (I welcome assistance on this though!). GTFS feeds are obtained from their respective transit agencies through OpenMobilityData.org (aka transitfeeds.com) which provides a large repository of current GTFS data from many agencies worldwide

## HTTP methods : 4 GET methods

### Routes
[deparch-js.herokuapp.com/routes](https://deparch-js.herokuapp.com/routes?feed=mbta/64)

Provides json output listing routes in a particular GTFS feed 

**Request parameters:**  
**feed**: A unique identifier for a GTFS feed

**Returns various fields provided by the GTFS feed, including:**

- **route_id**: Unique identifier for each route
- **route_short_name**: Name of a route. Some feeds provide route_long_name instead of this.
- **route_long_name**: Name of a route. Some feeds provide route_short name instead of this.

Additionally, **feed_version** is provided, specifying the particular publication of an agency’s GTFS feed used in this API.

Agencies update feeds annually, quarterly, monthly, weekly, or several times per week. I will make my best effort to reflect these updates regularly. During the COVID-19 pandemic, many agencies are altering the level of service provided, and some are making changes that are not reflected in GTFS feeds.

### Stops

[deparch-js.herokuapp.com/stops](https://deparch-js.herokuapp.com/stops?feed=mbta/64&route=Red)

Provides json output listing stops on a route.

**Request parameters**:  
**feed**: A unique identifier for a GTFS feed.
**route**: A unique identifier for a route. Can be obtained using the GET /routes method.

**Returns:**  
- **stop_name**: The name of a stop on this route.
- **stop_id**: A unique identifier for this stop.

### Dests

[deparch-js.herokuapp.com/dests](https://deparch-js.herokuapp.com/dests?feed=mbta/64&route=Red&origin=place-harsq)

Provides json output listing destinations *on a particular route* from the specified origin.

**Request parameters**:  
- **feed**: A unique identifier for a GTFS feed.
- **route**: A unique identifier for a route. Can be obtained using the GET /routes method.
- **origin**: A unique identifier for a stop (i.e. a stop_id) whose destination you want to query. Can be obtained using the GET /stops method

**Returns:**  
- **stop_name**: The name of a stop on this route reachable from `origin`.
- **stop_id**: A unique identifier for this stop.
￼￼

[deparch-js.herokuapp.com/tt](http://localhost:5000/tt?feed=mbta/64&route=Red&origin=place-harsq&dest=place-jfk&year=2020&month=4&date=20)

Provides json output listing destinations *on a particular route* from the specified origin.

**Request parameters:**
- **feed**: A unique identifier for a GTFS feed
- **route**: A unique identifier for a route. Can be obtained using the GET /routes method.
- **origin**: A unique identifier for a stop (i.e. a stop_id) that will be the origin for departures on the returned timetable. Departure times provided in the output are the times that vehicle leaves this stop. Can be obtained using the GET /stops method
- **dest**: A stop_id for the stop that will be the destination for departures on the returned timetable. Can be obtained using the GET /stops method
- **year**: The year of the specified trip.
- **month**: The month of the specified trip.
- **date**: The date of the specified trip.

**Returns:**
- **departure_time** 
- **from**: Name of the origin station
- **to**: Name of the destination station
- **route_id** A unique identifier for a route.
- **route_short_name**: Name of this route. Some feeds provide route_long_name instead of this.
- **route_long_name**: Name of this route. Some feeds provide route_short name instead of this.