var recognize = require('../lib/recognize.js');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('recognize', function() {
  this.timeout(20000);
  it('converts the file to text', function() {
    var inputFile = process.cwd() + "/test/resources/speech2cmd.raw";
    var phrases = [];
    var config = {
      encoding: 'LINEAR16',
      sampleRate: 16000,
      speechContext: {
        phrases: phrases,
      }
    };
    var promise = recognize(inputFile, config).then(function(r) {
      expect(r).to.have.property("results");
    });
    expect(promise).to.be.fulfilled;
    return promise;
  });
});
