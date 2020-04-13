const env = 'development';
const config = require('../../knexfile.js')[env];
const knex = require('knex')(config);

knex('feed').insert({id: 'who', title:'Example Fuid', location:0, latest:'nunyabeezwax'},/*returning =>*/'*').then(inserted =>{
    console.log(inserted)
}).catch(e =>{
    console.error(e)
})