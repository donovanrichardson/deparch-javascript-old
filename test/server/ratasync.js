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
    var l = await zip.getEntries().reduce((total, i)=>{
        // console.log(total)
        return i.getData().toString().length + total
    }, 0)
    // console.log(l)
    return l
}

axios.get(omd, {responseType: 'arraybuffer'}) //the await here is necessary for the test to pass
.then(async res =>{
    console.log(new Az(res.data));
    console.log(await entrydic(new Az(res.data)));
}).catch(e=>{
    console.error(e)
})