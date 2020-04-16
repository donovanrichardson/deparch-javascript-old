const express = require('express')
const app = express()
const Az = require('adm-zip');
var expect  = require('chai').expect;
var assert  = require('chai').assert;
const env = 'development';
const config = require('../../knexfile.js')[env];
const knex = require('knex')(config);
const axios = require('axios').default;
const { Readable } = require('stream');
const csv = require('csv-parser');
const neatCsv = require('neat-csv');



const api = "f700defc-6fcc-4c3f-9045-5ac5e91d7623" //env var
var feedid = 'mbta/64'
var q = `https://api.transitfeeds.com/v1/getFeedVersions?key=${api}&feed=${feedid}&page=1&limit=10&err=1&warn=1`
// console.log(q)
// var url = ""

const entrydic = async function(zip){
    var tootle = {}
    var l = await zip.getEntries()/*.forEach( async i */.reduce(async (total, i)=>{
        // console.log(total)
        /* total[i.entryName] = await  */
        await neatCsv(zip.readAsText(i)).then(j=>{
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
    /* await */ knex.batchInsert('agency', mod, 1000).transacting(tr)/* .then(batches =>{
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
    console.log(table[0])
    var mod = await addFv(filterFields(table, ["stop_id","stop_code","stop_name","stop_desc","stop_lat","stop_lon","stop_url","location_type","parent_station","wheelchair_boarding"]), feed_version)
    console.log(mod[0])
    
    /* await */ knex.batchInsert('stop', mod, 1000).transacting(tr)/* .then(batches =>{ //batches of 10000 was too big and broke the thing
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to stop`)
    }).catch(e =>{
        console.error(e)
    }) */
}

const addToRoute = async (table, tr) =>{
    var mod = await addFv(filterFields(table, ["route_id","agency_id","route_short_name","route_long_name","route_desc","route_type","route_url","route_sort_order"]), feed_version)
    knex.batchInsert('route', mod, 1000).transacting(tr)/* .then(batches =>{
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to route`)
    }).catch(e =>{
        console.error(e)
    }) */
}

const addToService = async  (table, tr) =>{
    if (table !== undefined){
        var mod = await addFv(filterFields(table, ["service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","start_date","end_date"]), feed_version)
        /* await */ 
        theq = `${knex('service').insert(mod).toString()} on conflict (service_id, feed_version) do nothing`
        console.log(theq)
        return tr.raw(theq)
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

gtfs = {}
var feed_version = ""
var feedinfo = {}

const init = async () =>{
    tranfeed = await axios.get(q).then(gotten =>{
        g = gotten.data.results.versions[0]
        // res.send(g)
        return(g)
    }).then(async tf =>{
        gtfs = await dataGive(tf.url);
        feedinfo = tf.f;
        feed_version = tf.id
        return tf
    }).catch(e =>{
        console.error(e)
    })  
}

const tx = async () => {
    await init()
    return knex.transaction((t) =>  {
        return knex('feed').transacting(t).insert({id: feedinfo.id,type: feedinfo.ty, title: feedinfo.t, location: feedinfo.l.id})
    .then(function() {
        return knex('feed_version').transacting(t).insert({id: tranfeed.id, feed: tranfeed.f.id, timestamp: tranfeed.ts, size: tranfeed.size, url: tranfeed.url, start: tranfeed.d.s, finish: tranfeed.d.f})
    }).then(()=>{
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
 }).finally(()=>{
     knex.destroy()
 });
}

tx();


 

//  return knex.transaction(function(t) {
//     return knex('feed')
//     .transacting(t)
//     .insert({id: 'gorl', title:'Example Fuid', location:0, latest:'nunyabeezwax'},/*returning =>*/'*')
//     .then(function(x) {
//          console.log(x);
//          return knex('feed').transacting(t).insert({id: 'queer', title:'Exampleyee Fuid', location:2, latest:'gaygay'},/*returning =>*/'*')
//     })
//     .then(t.commit)
//     .catch(function(e) {
//          t.rollback();
//          console.error(e)
//          throw e;
//     })
//  })
//  .then(function() {
//   // it worked
//  })
//  .catch(function(e) {
// //   console.error(e)
//  }).finally(()=>{
//      knex.destroy()
//  });