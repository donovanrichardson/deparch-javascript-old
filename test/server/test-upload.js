const Az = require('adm-zip');
var expect  = require('chai').expect;

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