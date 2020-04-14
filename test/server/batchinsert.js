const env = 'development';
const config = require('../../knexfile.js')[env];
const knex = require('knex')(config);

a = [];
for(var i = 0; i < 100000; i++){
    a.push({id: `example${i+1}`, title:'Example Fuid', location:"0", latest:'nunyabeezwax'})
}

knex.batchInsert('feed', a, 10000).then(batches =>{
    console.log(batches)
    return knex('feed').select().where({id: 'example20000'})
}).then(ex =>{
    console.log(ex)
    console.log('the example is above this')
    return knex('feed').where({title: 'Example Fuid'}).del()
}).then(delrows => {
    console.log(`${delrows} rows deleted`)
    knex.destroy()
}).catch(err =>{
    console.error(err)
    knex.destroy()
})