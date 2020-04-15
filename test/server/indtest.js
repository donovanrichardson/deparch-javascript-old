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
// const CircularJSON = require('circular-json'); //maybe uninstall

const api = "f700defc-6fcc-4c3f-9045-5ac5e91d7623" //env var

let omd = "https://openmobilitydata.org/p/mta/86/20200406/download"

var feed_version = "";

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

const addToAgency = async table =>{
    var mod = await addFv(filterFields(table, ['agency_id', 'agency_name', 'agency_url', 'agency_timezone']), feed_version)
    console.log(mod)
    await knex.batchInsert('agency', mod, 10000).then(batches =>{
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to agency`)
        return batches;
    }).catch(e =>{
        console.error(e)
    })

}

const addToStop= async table =>{
    console.log(table[0])
    var mod = await addFv(filterFields(table, ["stop_id","stop_code","stop_name","stop_desc","stop_lat","stop_lon","stop_url","location_type","parent_station","wheelchair_boarding"]), feed_version)
    console.log(mod[0])
    
    await knex.batchInsert('stop', mod, 200).then(batches =>{ //batches of 10000 was too big and broke the thing
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to stop`)
    }).catch(e =>{
        console.error(e)
    })
}

const addToRoute = async table =>{
    var mod = await addFv(filterFields(table, ["route_id","agency_id","route_short_name","route_long_name","route_desc","route_type","route_url","route_sort_order"]), feed_version)
    knex.batchInsert('route', mod, 200).then(batches =>{
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to route`)
    }).catch(e =>{
        console.error(e)
    })
}

const addToService = async table =>{
    if (table !== undefined){
        var mod = await addFv(filterFields(table, ["service_id","monday","tuesday","wednesday","thursday","friday","saturday","sunday","start_date","end_date"]), feed_version)
        await mod.forEach(async row =>{
            knex.raw(`${knex('service').insert(row).toString()} on conflict (service_id, feed_version) do nothing`).then(()=>{
                //
            }).catch(e =>{
                console.error(e)
            })
        })
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

const addCalendarDates = async table =>{
    var mod = await addFv(filterFields(table, ["service_id","date","exception_type"]), feed_version)
    knex.batchInsert('service_exception', mod, 200).then(batches =>{
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to service_exception`)
    }).catch(e =>{
        console.error(e)
    })
}

const addToShape = async table =>{
    var mod = await addFv(filterFields(table, ["shape_id","shape_pt_lat","shape_pt_lon","shape_pt_sequence","shape_dist_traveled"]), feed_version)
    knex.batchInsert('shape', mod, 200).then(batches =>{
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to shape`)
    }).catch(e =>{
        console.error(e)
    })
    
}

const addToTrip = async table =>{
    var mod = await addFv(filterFields(table, ["route_id","service_id","shape_id","trip_id","trip_headsign","trip_short_name","direction_id","block_id","wheelchair_accessible","bikes_allowed"]), feed_version)
    knex.batchInsert('trip', mod, 200).then(batches =>{
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to trip`)
    }).catch(e =>{
        console.error(e)
    })
}

const addToStopTime = async table =>{
    var mod = await addFv(filterFields(table, ["trip_id","arrival_time","departure_time","stop_id","stop_sequence","stop_headsign","pickup_type","drop_off_type","shape_dist_traveled","timepoint"]), feed_version)
    knex.batchInsert('stop_time', mod, 200).then(batches =>{
        console.log(`${batches.reduce( (total, r) =>{
            return total += r.rowCount;
        }, 0)} rows added to stop_time`)
    }).catch(e =>{
        console.error(e)
    })
}



// dataGive(omd).then(r=>{
//     console.log(r) //broke: console.log(dataGive(omd)) woke: commented
// })

app.get('/test', async (req, resp)=>{
    resp.send(await dataGive(omd))
})
//ooh yes wait a minute mr post man. i did it!! now, im realizing that i can do the gtfs import one-by-one without returning an object. howevur i think returing an object makes it make more sense for me. lol cuties

app.post('/feed', async (req, res) =>{
    var feed = req.query.id;
    var q = `https://api.transitfeeds.com/v1/getFeedVersions?key=${api}&feed=${feed}&page=1&limit=10&err=1&warn=1`
    console.log(q)
    var url = ""
    var fv = ""
    tranfeed = await axios.get(q).then(gotten =>{
        return gotten.data.results.versions[0]
    })
    try{
        var feed = tranfeed.f
        var url = tranfeed.url
        feed_version = tranfeed.id 
        //if not exists
        knex('feed').insert({id: feed.id,type: feed.ty, title: feed.t, location: feed.l.id}).then(result =>{
            console.log("feed added")
        }).then(()=>{
            return knex('feed_version').insert({id: tranfeed.id, feed: tranfeed.f.id, timestamp: tranfeed.ts, size: tranfeed.size, url: tranfeed.url, start: tranfeed.d.s, finish: tranfeed.d.f})
        }).then(async result =>{
            console.log("feed_version added")
            gtfs = await dataGive(url);
            await addToAgency(gtfs["agency.txt"])
            await addToStop(gtfs["stops.txt"]);
            /*await addToRoute(gtfs["routes.txt"]) //temporarily
            // if(gtfs["calendar.txt"] !== undefined){
            await addToService(gtfs["calendar.txt"])
            
            // }
            // if(gtfs["calendar_dates.txt"] !== undefined){
            //     res.send("daldates man")
            await addToService(gtfs["calendar_dates.txt"])
            await addCalendarDates(gtfs["calendar_dates.txt"]).then(msg =>{
                res.send(msg)
            }).catch(e=>console.error(`finally, ${e}`)) //so i wrote this wrong the first time and the insert just silently stalled and i didn't know what happened until i saw that these infos werent in the db
            // }
            // await addToShape(gtfs["shapes.txt"]) shapes is not necessarily in the feed

            await addToTrip(gtfs["trips.txt"])
            await addToStopTime(gtfs["stop_times.txt"]) */
        })
        // console.log(tranfeed.f.id)
        // console.log("above is fid")
        
        
        // Promise.all
        
        /* addToStop(gtfs["stops.txt"])
        addToRoute(gtfs["routes.txt"])
        if(gtfs["calendar.txt"] !== undefined){
            addToService(gtfs["calendar.txt"])
        }
        if(gtfs["calendar_dates.txt"] !== undefined){
            addToService(gtfs["calendar_dates.txt"])
        }
        // addToService(gtfs["calendar.txt"])
        // addCalendarDates(gtfs["calendar_dates.txt"])
        // console.log(gtfs["calendar_dates.txt"])
        //addToShape(gtfs["shapes.txt"]) //shapes is cancelled i literally dont know what to do with her
        addToTrip(gtfs["trips.txt"])
        addToStopTime(gtfs["stop_times.txt"]) */
    }catch(e){
        console.error(e)
    }finally{
        // knex.destroy() //figure out how to do this

    }
})
app.listen(5000, function () {
    console.log('App listening on port 5000!')
  })