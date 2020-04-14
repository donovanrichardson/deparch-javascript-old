const env = 'development';
const config = require('../../knexfile.js')[env];
const knex = require('knex')(config);

knex('feed').insert({id: 'gorl', title:'Example Fuid', location:0, latest:'nunyabeezwax'},/*returning =>*/'*').then(inserted =>{
    console.log(inserted)
    return knex('feed').count('*', {as: 'num'}).where({title:'Example Fuid'});
}).then(countrec =>{
    console.log(countrec)
    return knex('feed').where({title: 'Example Fuid'}).del()
}).then(deleted =>{
    console.log(`${deleted} rows deleted`)
    knex.destroy()
}).catch(e =>{
    console.error(e)
    knex.destroy()
})