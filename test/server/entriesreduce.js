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

// const axy = (() =>{
    

// axios.get(omd, {responseType: 'arraybuffer'}) //the await here is necessary for the test to pass
// .then(res =>{
//     return new Az(res.data);
// }).then(az =>{
//     az.getEntries().forEach(function(zipEntry) {
// 	    // console.log(zipEntry.toString()); // outputs zip entries information
// 		console.log (zipEntry.getData().toString('utf8'))
// 	});
// })

// console.log(ze)

// })

axios.get(omd, {responseType: 'arraybuffer'}) //the await here is necessary for the test to pass
.then(res =>{
    return new Az(res.data);
}).then(async az =>{
    // console.log(typeof az)
    // console.log(az.getEntries())
    // az.getEntries().forEach(e =>{
    //     console.log(e.entryName)
    // })
    cc= await az.getEntries().reduce(
        async (total, i) =>{
        // return total.concat(i.entryName).concat('\n')
        txt = i.getData().toString()
        await neatCsv(txt)
        .then(gtfsobj =>{
            return gtfsobj.length + total
        }).catch(err =>{
            console.error(err)
        })
        // console.log(/* typeof */ cc)
    }, /* "" */ 0)
    console.log(cc)
}).catch(err =>{
    console.error(err)
})

// console.log(axy())

// var dic = {}
// const entry = async(zip) =>{
//     dic = {}
//     await zip.getEntries().forEach( async (ent) =>{
//         await neatCsv(zip.readAsText(ent)).then(results =>{
//             // console.log(ent.entryName)
//             // console.log(results[0])
//             // dic[ent.entryName] = results[0]
//             return {key: "key", value: results}
//         }).then(kv =>{
//             dic[kv.key] = kv.value
//         }).catch(e =>{
//             console.error(e)
//         })
//     })
//     console.log(dic)
// }