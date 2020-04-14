const Az = require('adm-zip');
var request = require('request');
const axios = require('axios').default;
const { Readable } = require('stream');
const csv = require('csv-parser');
const neatCsv = require('neat-csv');



// let omd = "https://openmobilitydata.org/p/mbta/64/20200411/download"
let omd = "https://openmobilitydata.org/p/mta/86/20200406/download"

// request.get({url: omd, encoding: null}, (err, res, body) => {
//     var zip = new Az(body);
//     var zipEntries = zip.getEntries();
//     forImport = {}
//     zipEntries.forEach( entry =>{
//         results = []
//         Readable.from(zip.readAsText(entry))
//         .pipe(csv())
//         .on('data', (data) => results.push(data))
//         .on('end', () => {
//             // console.log(entry.entryName)
//             forImport[entry.entryName] = results
//             // console.log(Object.keys(forImport))
//         });

//         /* readable.on("data", (chunk) => {
//         console.log(chunk)
//         })
//         console.log(zip.readAsText(entry).length) */
//     })
//     console.log(Object.keys(forImport))
//   })
var dict = []

const giveNum = function(num){
    console.log(4+num)
    dict.push(num)
}

axios.get(omd, {responseType: 'arraybuffer'}).then(res =>{
    // console.log(res.data)
    return new Az(res.data);
}).then( (zip) =>{
     zip.getEntries().forEach( async (ent) =>{
        var results = await neatCsv(zip.readAsText(ent))
        // Readable.from(zip.readAsText(ent))
        // .pipe(csv())
        // .on('data', (data) => results.push(data))
        // .on('end', () => {
        //     console.log(`${ent.entryName} added`)
        // });
        // console.log(results)
        // console.log("above are results")
        // dict[ent.entryName] = 1;
        dict.push(1)
    })
    console.log(dict)
}).then(r =>{
    // console.log(dict)
}).catch(e =>{
    console.error(e)
})

/* request.get({url: omd, encoding: null}).then((res, body) =>{
    var zip = new Az(body);
    var zipEntries = zip.getEntries();
    forImport = {}
    zipEntries.forEach( entry =>{
        results = []
        Readable.from(zip.readAsText(entry))
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(entry.entryName)
            forImport[entry.entryName] = results
        });

        /* readable.on("data", (chunk) => {
        console.log(chunk)
        })
        console.log(zip.readAsText(entry).length) */
//     })
// }).catch(err =>{
//     console.error(err)
// }) */


//   console.log(forImport);


