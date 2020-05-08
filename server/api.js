const Az = require('adm-zip');
const env = process.env.DEVPROD;
const config = require('../knexfile.js')[env];
const config2 = require('../knexfile.js')["production"];
var knex = require('knex')(config);
const axios = require('axios').default;
// const { Readable } = require('stream');
// const csv = require('csv-parser');
const neatCsv = require('neat-csv');
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; //case insensitive

// console.log(q)
// var url = ""

const entrydic = async function(zip){
    var tootle = {}
    var l = await zip.getEntries()/*.forEach( async i */.reduce(async (total, i)=>{
        // console.log(total)
        /* total[i.entryName] = await  */
        await neatCsv(zip.readAsText(i),{
            mapHeaders: ({ header, index }) => header.trim() //i would love if agencies did not include unnecessary whitespace in their data
            }).then(j=>{
            tootle[i.entryName] = j
        }).catch(e=>{
            console.error(e)
        })
        // tootle[i.entryName] = await neatCsv(zip.readAsText(i))
        return tootle; //returning ${total} for some reason doesnt work                 
        // return i.getData().toString().length + total
    }, {})
    // console.log(l)
    return l
}

const addFv = async(table, fv) =>{
    // console.log(a[0])
    r = await table.map( e =>{
        e["feed_version"] = fv
        return e
    })
    return r
    
}

// const importfeed = 
const dataGive = async link =>{
    return await axios.get(link, {responseType: 'arraybuffer'}) //the await here is necessary for the test to pass
    .then(async res =>{
        // new Az(res.data).read
        // console.log(new Az(res.data));
        // console.log(await entrydic(new Az(res.data)));
        // resp.send(await entrydic(new Az(res.data)))
        var geodata = await entrydic(new Az(res.data))
        return geodata
    })/* .then(async (data) =>{
        // console.log(addFv(data["routes.txt"]))
        exam = await addFv(data["routes.txt"])
        return exam;
    }) */.catch(e=>{
        console.error(e)
    })
} //it's taken me a #hashtag long time to figure out that i need to return from a then

const filterFields = (table, allowed) =>{
    return table.map(row =>{
    const filtered = Object.keys(row)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = row[key];
      return obj;
    }, {});
  return filtered
    })
}

const addToAgency = async (table, tr) =>{
    var mod = await addFv(filterFields(table, ['agency_id', 'agency_name', 'agency_url', 'agency_timezone']), feed_version)
    console.log(mod)
    /* await */return knex.batchInsert('agency', mod, 1000).transacting(tr)/* .then(batches =>{
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to agency`)
        return batches;
    }).catch(e =>{
        console.error(e)
    })
 */
}

const addToStop= async (table, tr) =>{
    // console.log(table[0])
    var mod = await addFv(filterFields(table, ["stop_id","stop_code","stop_name","stop_desc","stop_lat","stop_lon","stop_url","location_type","parent_station","wheelchair_boarding"]), feed_version)
    console.log(mod[0])
    
    /* await */return knex.batchInsert('stop', mod, 1000).transacting(tr)/* .then(batches =>{ //batches of 10000 was too big and broke the thing
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to stop`)
    }).catch(e =>{
        console.error(e)
    }) */
}

const addToRoute = async (table, tr) =>{
    var mod = await addFv(filterFields(table, ["route_id","agency_id","route_short_name","route_long_name","route_desc","route_type","route_url","route_sort_order","route_color", "route_text_color"]), feed_version)
    return knex.batchInsert('route', mod, 1000).transacting(tr)/* .then(batches =>{
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to route`)
    }).catch(e =>{
        console.error(e)
    }) */
}

const addToService = async  (table, tr) =>{
    if (table !== undefined){
        // console.log(table)
        var mod = await addFv(filterFields(table, ["service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","start_date","end_date"]), feed_version)
        /* await */ 
        if (mod.length > 0){ //not needed for batch insert
            theq = `${knex('service').insert(mod).toString()} on conflict (service_id, feed_version) do nothing`
            // console.log(theq)
            return tr.raw(theq)
    }
/*         mod.forEach(async row =>{
            knex.raw(`${knex('service').insert(row).toString()} on conflict (service_id, feed_version) do nothing`).then(()=>{
                //
            }).catch(e =>{
                console.error(e)
            })
        }) */
        // return mod.forEach(async row=>{
        //     return knex.raw(`${knex('service').insert(row).toString()} on conflict (service_id, feed_version) do nothing`).then(r =>{
        //         rows++;
        //     }).catch(e =>{
        //         console.error(e)
        //     })
        // })
        // .then(() =>{
        //     return `${rows} rows added to service`;
        // })/* 
        // knex.batchInsert('service', mod, 10000).then(batches =>{
        //     console.log(`${batches.reduce( (total, r) =>{
        //         return total += r.rowCount;
        //     }, 0)} rows added to service`)
        // }) */.catch(e =>{
        //     console.error(e)
        // }).finally(()=>{
        //     // return "serviced!"
        // })
    }
}

const addCalendarDates = async (table, tr) =>{
    if(table !== undefined){
        var mod = await addFv(filterFields(table, ["service_id","date","exception_type"]), feed_version)
        return knex.batchInsert('service_exception', mod, 1000).transacting(tr)/* .then(batches =>{
            console.log(`${batches.reduce( (total, r) =>{
                return total += r.rowCount;
            }, 0)} rows added to service_exception`)
        }).catch(e =>{
            console.error(e)
        }) */
    }
}

const addToShape = (table, tr) =>{
    var mod = /* await */ addFv(filterFields(table, ["shape_id","shape_pt_lat","shape_pt_lon","shape_pt_sequence","shape_dist_traveled"]), feed_version)
    return knex.batchInsert('shape', mod, 1000).transacting(tr)/* .then(batches =>{
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to shape`)
    }).catch(e =>{
        console.error(e)
    }) */
    
}

const addToTrip = async (table, tr) =>{
    var mod = await addFv(filterFields(table, ["route_id","service_id","shape_id","trip_id","trip_headsign","trip_short_name","direction_id","block_id","wheelchair_accessible","bikes_allowed"]), feed_version)
    return knex.batchInsert('trip', mod, 1000).transacting(tr)/* .then(batches =>{
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to trip`)
    }).catch(e =>{
        console.error(e)
    }) */
}

const addToStopTime = async (table, tr) =>{
    var mod = await addFv(filterFields(table, ["trip_id","arrival_time","departure_time","stop_id","stop_sequence","stop_headsign","pickup_type","drop_off_type","shape_dist_traveled","timepoint"]), feed_version)
    return knex.batchInsert('stop_time', mod, 1000).transacting(tr)/* .then(batches =>{
        console.log("why haint you inserting")
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to stop_time`)
    }).catch(e =>{
        console.error(e)
    }) */
}

const api = "f700defc-6fcc-4c3f-9045-5ac5e91d7623" //env var
// var feedid = 'mbta/64'

url = ''
var feed_version = ""
var feedinfo = {}

const init = async (feed) =>{
    var q = `https://api.transitfeeds.com/v1/getFeedVersions?key=${api}&feed=${feed}&page=1&limit=10&err=1&warn=1`
    tranfeed = await axios.get(q).then(gotten =>{
        g = gotten.data.results.versions[0]
        // res.send(g)
        return(g)
    }).then(async tf =>{
        url = tf.url
        feedinfo = tf.f;
        feed_version = tf.id
        return tf
    }).catch(e =>{
        console.error(e)
    })  
}

const getFv = async(feed) =>{
    return knex('feed').select().where({id: feed}).first().then(feed =>{
        return feed.latest
    }).catch(e=>{
        console.error(e)
    })
}

const getTT = async(route, origin, dest, date, feed) =>{
    fv = await getFv(feed)

    mdy = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}`

    //in thhe future i can return the route info separately from the departure rows
    return await knex.raw(
    `SELECT DISTINCT 
    sq2.departure_time, 
    stop2.stop_name AS from, 
    stop.stop_name AS to, 
    trip.route_id,
    route.route_short_name,
    route.route_long_name,
    route.route_color,
    route.route_text_color
  FROM stop_time AS sq1
    LEFT OUTER JOIN stop
    ON (
      stop.stop_id = sq1.stop_id
      AND stop.feed_version = sq1.feed_version
    )
    LEFT OUTER JOIN trip
    ON (
      trip.trip_id = sq1.trip_id
      AND trip.feed_version = sq1.feed_version
    )
    LEFT OUTER JOIN route
    ON (
        trip.route_id = route.route_id
        AND trip.feed_version = route.feed_version
    )
    RIGHT OUTER JOIN stop_time AS sq2
    ON (
      sq2.trip_id = sq1.trip_id
      AND sq2.feed_version = sq1.feed_version
    )
    LEFT OUTER JOIN stop AS stop2
    ON (
      sq2.stop_id = stop2.stop_id
      AND sq2.feed_version = stop2.feed_version
    )
  WHERE (
    sq1.stop_sequence > sq2.stop_sequence
    AND stop2.parent_station = :ori
    AND stop.parent_station = :des
    AND trip.service_id IN (
      SELECT service.service_id
      FROM service
      WHERE (
        EXISTS (
          SELECT 
            service_exception.service_id, 
            service_exception.date, 
            service_exception.exception_type, 
            service_exception.feed_version
          FROM service_exception
          WHERE (
            service_exception.date = :dat
            AND service.service_id = service_exception.service_id
            AND service_exception.exception_type = 1
            AND service_exception.feed_version = :ver
            AND service.feed_version = :ver
          )
        )
        OR (
          :dat BETWEEN cast(service.start_date AS integer) AND cast(service.end_date AS integer)
          AND service.${weekdays[date.getDay()]} = 1
          AND service.feed_version = :ver
          AND NOT EXISTS (
            SELECT 
              service_exception.service_id, 
              service_exception.date, 
              service_exception.exception_type, 
              service_exception.feed_version
            FROM service_exception
            WHERE (
              service_exception.date = :dat
              AND service.service_id = service_exception.service_id
              AND service_exception.exception_type = 2
              AND service_exception.feed_version = :ver
            )
          )
        )
      )
    )
    AND trip.feed_version = :ver
    AND trip.route_id = :rou
  )
  ORDER BY sq2.departure_time`,{
      ver: fv,
      rou: route,
      ori: origin,
      des: dest,
      dat: mdy
  }
    ).then(timetable=>{
        console.log(timetable)
        return timetable.rows
    })
}

const getDests = async (route, origin, feed) =>{
    fv = await getFv(feed)

    return knex.raw(`SELECT DISTINCT ps1.stop_id, ps1.stop_name FROM stop_time LEFT JOIN stop ON stop.stop_id = stop_time.stop_id AND stop.feed_version = stop_time.feed_version LEFT JOIN stop AS ps1 ON stop.parent_station = ps1.stop_id AND stop.feed_version = ps1.feed_version LEFT JOIN trip ON trip.trip_id = stop_time.trip_id AND trip.feed_version = stop_time.feed_version RIGHT JOIN stop_time AS st2 ON st2.trip_id = stop_time.trip_id AND st2.feed_version = stop_time.feed_version LEFT JOIN stop AS stop2 ON stop2.stop_id = st2.stop_id AND stop2.feed_version = st2.feed_version LEFT JOIN stop AS ps2 ON stop2.parent_station = ps2.stop_id AND stop2.feed_version = ps2.feed_version WHERE trip.route_id = :rou AND stop_time.stop_sequence > st2.stop_sequence AND ps2.stop_id = :ori AND stop_time.feed_version = :ver;`,{
        rou: route,
        ori: origin,
        ver: fv
    }).then(d =>{
        return d.rows;
    }).catch(e=>{
        console.error(e)
    }) //this can be changed to use stop.parent_station instead of parent.stop_id
}

const getStops = async (route, feed) =>{

    fv = await getFv(feed)

    var result = await knex('stop_time').distinct('stop.parent_station as stop_id', 'stop.stop_name').leftJoin('trip', function() {this.on('trip.trip_id','=','stop_time.trip_id').on('trip.feed_version','=','stop_time.feed_version')}).leftJoin('stop',function() {this.on('stop_time.stop_id','=','stop.stop_id').on('stop.feed_version','=','stop_time.feed_version')}).where('trip.route_id', route).where("stop_time.feed_version", fv)
    return result;
}

const getRoutes = async (feed) => {
    var result = await knex('feed').select().where({id: feed}).then(r =>{
        var routefv = r[0].latest //am i not able to use getFv?
        return knex('route').select().where({feed_version: routefv}) //may be good to ensure order by route order???
    }).catch(e =>{
        console.error(e)
    })/* .finally(()=>{
        knex.destroy();
    }) */
    return result
}

const rmfv = async (fv) =>{
    return knex.transaction((t) =>  {
        return knex('stop_time').transacting(t).delete().where({feed_version: fv})
    .then(function() {
        return knex('trip').transacting(t).delete().where({feed_version: fv})
    })./* then(()=>{
        return knex('shape').transacting(t).delete().where({feed_version: fv})
    }). */then(()=>{
        return knex('service_exception').transacting(t).delete().where({feed_version: fv})
    }).then(()=>{
        return knex('service').transacting(t).delete().where({feed_version: fv})
    }).then(()=>{
        return knex('route').transacting(t).delete().where({feed_version: fv})
    }).then(()=>{
        return knex('stop').transacting(t).delete().where({feed_version: fv})
    }).then(()=>{
        return knex('agency').transacting(t).delete().where({feed_version: fv})
    }).then(()=>{
        return knex('feed_version').transacting(t).delete().where({id: fv})
    })
    .then(t.commit)
    .catch(function(e) {
         t.rollback();
         console.error(e)
         throw e;
    })
 })
 .then(function() {
  // it worked
 })
 .catch(function(e) {
//   console.error(e)
 })/* .finally(()=>{
     knex.destroy()
 }); */
}

const impfeed = async (feedId) => {
    var gtfs = {}
    await init(feedId)
    console.log("init fv")
    return knex.transaction((t) =>  {
        console.log("insert f")
        return t.raw(`${knex('feed').insert({id: feedinfo.id,type: feedinfo.ty, title: feedinfo.t, location: feedinfo.l.id})}on conflict (id) do nothing`) 
    .then(async function() {
        return knex('feed_version').transacting(t).insert({id: tranfeed.id, feed: tranfeed.f.id, timestamp: tranfeed.ts, size: tranfeed.size, url: tranfeed.url, start: tranfeed.d.s, finish: tranfeed.d.f})
    }).then(async ()=>{
        console.log(url);
        gtfs = await dataGive(url);
        return addToAgency(gtfs["agency.txt"], t)
    }).then(()=>{
        return addToStop(gtfs["stops.txt"], t)
    }).then(()=>{
        return addToRoute(gtfs["routes.txt"], t)
    }).then(()=>{
        return addToService(gtfs["calendar.txt"], t)
    }).then(()=>{
        return addToService(gtfs["calendar_dates.txt"], t)
    }).then(()=>{
        return addCalendarDates(gtfs["calendar_dates.txt"], t)
    }).then(()=>{
        return addToTrip(gtfs["trips.txt"], t)
    }).then(()=>{
        return addToStopTime(gtfs["stop_times.txt"], t)
    }).then(()=>{
        return knex('stop').transacting(t).update({parent_station: knex.ref('stop_id')}).where({location_type:'0'}).where(w => w.where({parent_station: ''}).orWhereNull('parent_station'))
    }).then(()=>{
        return t.raw(`update stop set parent_station = parent.parent_station from stop as parent where stop.parent_station = parent.stop_id and stop.feed_version = parent.feed_version and stop.location_type = '4'`)
    }).then(()=>{
        return knex('feed').transacting(t).update({latest: feed_version}).where({id: feedinfo.id})
    })
    .then(t.commit)
    .catch(function(e) {
         t.rollback();
         console.error(e)
         throw e;
    })
 })
 .then(function() {
  // it worked
 })
 .catch(function(e) {
//   console.error(e)
 })/* .finally(()=>{
     knex.destroy()
 }); */
}

// tx();
// rmfv('mbta/64/20200416')
// getRoutes('mbta/64');

// console.log(getDests('39', 'forhl', 'fv'))

const feeds = () =>{
    return knex('feed').select("id").then(f =>{
        console.log(f) //feeds(...).forEach is not a function hmmmmm
        return f;
    }).catch(e =>{
        console.error(e)
    }).finally(()=>{
        knex.destroy()
    })
}

const changeKnex = () =>{
    knex = require('knex')(config2);
}

const prodfeeds = () =>{
    changeKnex()
    feeds()
}

const localImp = async (feed) =>{
    changeKnex()
    start = process.hrtime()
    impfeed(feed).then((imp)=>{
        console.log(`${imp} <- was imported`)
        return process.hrtime(start)
    }).then(time =>{
        console.log(`${time[0]}s, ${time[1]/1000000}ms`) //put this in the regular imp
    }).finally(()=>{
        knex.destroy()
    })
    
}

// feeds()
// prodfeeds() //query current feeds
// impAll()
// localImp(/* insert feed here */)

//  // localImp("bart/58")
//   localImp('mta/79')
//   localImp('mta/86')
//   localImp('rabbit-transit/383')
//   localImp('mbta/64')
//   localImp('septa/262')
// //  localImp('septa/263')
// impfeed('septa/262')
// impfeed('septa/262')

// localImp("mbta/64") //update feeds
//\{(.*?)('.*?')(.*?)\},*$ -> localImp($2)

//mta/79
//rabbit-transit/383

module.exports = {impfeed , rmfv, getRoutes, getStops, getDests, getTT, localImp, prodfeeds}
