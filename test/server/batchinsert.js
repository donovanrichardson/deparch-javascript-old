const env = 'development';
const config = require('../../knexfile.js')[env];
const knex = require('knex')(config);

a = [];
for(var i = 0; i < 100; i++){
    a.push({id: `example${i+1}`, title:'Example Fuid', location:"0", latest:'nunyabeezwax'})
}



// const filterFields = (table, allowed) =>{
//     return table.map(row =>{
//     const filtered = Object.keys(row)
//     .filter(key => allowed.includes(key))
//     .reduce((obj, key) => {
//       obj[key] = row[key];
//       return obj;
//     }, {});
//   return filtered
//     })
// }

// console.log(filterFields(a, ['id', 'title']))

// const mappr = async() =>{
//     // console.log(a[0])
//     m = await a.map( e =>{
//         e["feed_version"] = "fv1"
//         return e
//     })
//     // console.log("the map has executed")
//     console.log(m[0])
//     return m[0]
    
// }

// const logmap = async () =>{
//     rez = await mappr().then(m =>{
//         return m
//     }).catch(e =>{
//         console.error(e)
//     })
//     return rez;
// }

// console.log(logmap())

// knex.batchInsert('feed', a, 10000).then(batches =>{
//     console.log(`${batches.reduce( (total, r) =>{
//         return total += r.rowCount;
//     }, 0)} rows added`)
//     // console.log(batches)
//     // console.log("above are batches")
//     return knex('feed').select().where({id: 'example20000'})
// }).then(ex =>{
//     console.log(ex)
//     console.log('the example is above this')
//     return knex('feed').where({title: 'Example Fuid'}).del()
// }).then(delrows => {
//     console.log(`${delrows} rows deleted`)
//     knex.destroy()
// }).catch(err =>{
//     console.error(err)
//     knex.destroy()
// })

// console.log(knex.batchInsert('feed', a, 10000).toString());

// console.log(knex('feed').insert(a).toString());

// console.log(knex('stop').update({parent_station: knex.ref('stop_id')}).where({location_type:'0', parent_station: null}).toString())

// console.log(knex('stop').update({parent_station: knex.ref('stop_id')}).where({location_type:'0'}).whereNull('parent_station').toString())

//the above two are the same

console.log(knex('stop').update({parent_station: knex.ref('stop_id')}).where({location_type:'0'}).where(w => w.where({parent_station: ''}).orWhereNull('parent_station')).toString())