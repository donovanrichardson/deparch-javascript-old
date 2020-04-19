const express = require('express')
const app = express()
// const Az = require('adm-zip');
const env = process.env.DEVPROD;
// const config = require('../knexfile')[env];
// const knex = require('knex')(config);
// const axios = require('axios').default;
// const { Readable } = require('stream');
// const csv = require('csv-parser');
// const neatCsv = require('neat-csv');
const {impfeed , rmfv, getRoutes, getStops, getDests, getTT} = require('./api')
// const CircularJSON = require('circular-json'); //maybe uninstall



// dataGive(omd).then(r=>{
//     console.log(r) //broke: console.log(dataGive(omd)) woke: commented
// })

//ooh yes wait a minute mr post man. i did it!! now, im realizing that i can do the gtfs import one-by-one without returning an object. howevur i think returing an object makes it make more sense for me. lol cuties

app.post('/feed', async (req, res) =>{
    var feedid = req.query.id;
    var key = req.query.key
    if(key == process.env.DPCHKEY){
        impfeed(feedid).then(r=>{
            res.send({result: r}) //make this more verbose, send response code
        }).catch(e =>{
            res.send({result: "there was an error"})
            console.error(e)
        })
    }else{
        res.send({result: "wrong api key"})
    }
})

app.get('/routes', async(req, res) =>{
    var feed = req.query.feed
    getRoutes(feed).then(rts =>{
        res.send(rts)
    }).catch(e =>{
        console.error(e)
    })
})

app.get('/stops', async(req, res) =>{
    var feed = req.query.feed;
    var route = req.query.route;
    getStops(route, feed).then(stops =>{
        res.send(stops)
    }).catch(e =>{
        console.error(e)
    })
})

app.get('/dests', async(req, res) =>{
    var feed = req.query.feed;
    var route = req.query.route;
    var origin = req.query.origin;
    getDests(route, origin, feed).then(dests =>{
        res.send(dests)
    }).catch(e =>{
        console.error(e)
    })
})

app.get('/tt', async(req, res) =>{
    var feed = req.query.feed;
    var route = req.query.route;
    var origin = req.query.origin;
    var dest = req.query.dest;
    var year = req.query.year;
    var month = req.query.month;
    var day = req.query.date;
    var ymd = new Date(year, month - 1, day)
    getTT(route, origin, dest, ymd, feed).then(dests =>{
        res.send(dests)
    }).catch(e =>{
        console.error(e)
    })
})

app.listen(process.env.PORT || 5000, function () {
    console.log('Server is running')
  })