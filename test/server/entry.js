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

var dic = {}
const entry = async(zip) =>{
    dic = {}
    await zip.getEntries().forEach( async (ent) =>{
        await neatCsv(zip.readAsText(ent)).then(results =>{
            // console.log(ent.entryName)
            // console.log(results[0])
            // dic[ent.entryName] = results[0]
            return {key: "key", value: results}
        }).then(kv =>{
            dic[kv.key] = kv.value
        }).catch(e =>{
            console.error(e)
        })
    })
    console.log(dic)
}

axios.get(omd, {responseType: 'arraybuffer'}) //the await here is necessary for the test to pass
.then(res =>{
    return new Az(res.data);
}).then(az =>{
    entry(az)
}).catch(err =>{
    console.error(err)
})

// it('dumb', ()=>{
//     expect(2).to.equal({})
// })

console.log({key: "key", value: "value"})