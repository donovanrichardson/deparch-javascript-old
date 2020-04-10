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

    after(async () => {
        await knex.destroy()
      })

/*     it('inserts', (done) =>{
        const theTest = () =>{
            knex('feed').insert({id: 'exam', title:'Example Fuid', location:0, latest:'nunyabeezwax'},'*').then( function(r){
                return r[0]['id'];
                done();
            }).catch((err) => {
                done();
            })
        }

        expect(theTest()).to.equal("exam")
        
    })

    it('deletes', (done) => {
        knex('feed').where('id', 'exam').del().then( (removed) => {
            expect(removed).to.equal(2)
            done();
        }).catch((err) => {
            console.error(err);
            done();
        })
    }) */
});

describe("scope", async () => {
    it('does the thing', async() =>{

    const nunya = async () =>{
        return await knex('feed').insert({id: 'exam', title:'Example Fuid', location:0, latest:'nunyabeezwax'},'*').rows
    }

    try {
        const bees = await nunya();
        expect(typeof(bees)).to.equal('');
    }catch (e){
        console.error(e);
    }

    // console.log(knex('feed').insert({id: 'exam', title:'Example Fuid', location:0, latest:'nunyabeezwax'},'*'));

    // after(async () => {
    //     await knex.destroy()
    //   })

    // const theId = async () =>{
    //     await knex('feed').insert({id: 'exam', title:'Example Fuid', location:0, latest:'nunyabeezwax'},'*').then( function(r){
    //         // console.log(r[0]['id']);
    //         return r[0]['id'];
    //     }).catch((err) => {
    //         console.error(err);
    //     })
    // }

    // const howManyDeleted = async () => {
    //         await knex('feed').where('id', 'exam').del().then( (removed) => {
    //             return removed;
    //         }).catch((err) => {
    //             console.error(err);
    //     })
    // }

    // console.log(typeof(theId()));
    // console.log(typeof(howManyDeleted()));

    // expect(theId()).to.equal('1');

    // it("is 4", () =>{
    //     let answer = () =>{
    //         return 2 + 2
    //     }
    //     expect(answer()).to.equal(5);
    // })
})
})