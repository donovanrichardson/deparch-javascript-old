const Az = require('adm-zip');
var expect  = require('chai').expect;
const env = 'development';
const config = require('../../knexfile.js')[env];
const knex = require('knex')(config);

describe("example-zip", function(){
    it("this is just a test", () => {
        expect(1).to.equal(1);
    })
    it("has seven files", function(){
        // console.log(window.location.pathname);
            let zipfile = new Az('test/server/example/example.zip');
            let entries = zipfile.getEntries();
            expect(entries.length).to.equal(7);
    })
})

describe("insertions", function(){

    afterEach(async () => {
        await knex.destroy()
      })

    it('inserts', (done) =>{
        knex('feed').insert({id: 'exam', title:'Example Fuid', location:0, latest:'nunyabeezwax'},'*').then( function(r){
            const theid = r[0]['id'];
            expect(theid).to.equal('exam');
            done();
        }).catch((err) => {
            console.error(err);
            done();
        })
    })

    it('deletes', (done) => {
        knex('feed').where('id', 'exam').del().then( (removed) => {
            console.log(removed);
            done();
        }).catch((err) => {
            console.error(err);
            done();
        })
    })
});
