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

let omd = "https://openmobilitydata.org/p/mta/86/20200406/download"

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

const addFv = async(a) =>{
    // console.log(a[0])
    r = await a.map( e =>{
        e["feed_version"] = "fv1"
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
    }).then(async (data) =>{
        // console.log(addFv(data["routes.txt"]))
        exam = await addFv(data["routes.txt"])
        return exam;
    }).catch(e=>{
        console.error(e)
    })
} //it's taken me a #hashtag long time to figure out that i need to return from a then

// dataGive(omd).then(r=>{
//     console.log(r) //broke: console.log(dataGive(omd)) woke: commented
// })

app.get('/test', async (req, resp)=>{
    resp.send(await dataGive(omd))
})
//ooh yes wait a minute mr post man. i did it!! now, im realizing that i can do the gtfs import one-by-one without returning an object. howevur i think returing an object makes it make more sense for me. lol cuties

app.listen(5000, function () {
    console.log('App listening on port 5000!')
  })