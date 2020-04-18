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
const {impfeed , rmfv, getRoutes, getStops, getDests, getTT} = require('./transaction')
// const CircularJSON = require('circular-json'); //maybe uninstall



// dataGive(omd).then(r=>{
//     console.log(r) //broke: console.log(dataGive(omd)) woke: commented
// })

//ooh yes wait a minute mr post man. i did it!! now, im realizing that i can do the gtfs import one-by-one without returning an object. howevur i think returing an object makes it make more sense for me. lol cuties

app.post('/feed', async (req, res) =>{
    var feedid = req.query.id;
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

app.listen(5000, function () {
    console.log('App listening on port 5000!')
  })