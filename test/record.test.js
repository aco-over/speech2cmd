var fs = require('fs');
var record = require('../lib/record.js');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('record', function() {
  this.timeout(20000);
  it('creates file', function() {
    var promise = record().then(function() {
      expect(fs.existsSync('/tmp/speech2cmd.raw')).to.equal(true);
    });
    expect(promise).to.be.fulfilled;
    return promise;
  });
});
