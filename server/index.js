const express = require('express')
const app = express()

app.get('/test', (req, res) =>{
    
})

axios.get(omd, {responseType: 'arraybuffer'}).then(res =>{
    // console.log(res.data)
    var zip = new Az(res.data);
    forImport = {}
    zip.getEntries().forEach( ent =>{
        var results = []
        Readable.from(zip.readAsText(ent))
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            forImport[ent.entryName] = results
            // console.log(forImport);
            // console.log(forImport.keys)
        });
    })
/*     zipEntries.forEach( entry =>{
        console.log(entry.entryName);
        // results = []
        // Readable.from(zip.readAsText(entry))
        // .pipe(csv())
        // .on('data', (data) => results.push(data))
        // .on('end', () => {
        //     console.log(entry.entryName)
        //     forImport[entry.entryName] = results
        // });
}) */
}).catch(e =>{
    console.error(e)
})