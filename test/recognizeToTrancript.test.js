var expect = require('chai').expect;
var recognizeToTranscript = require('../lib/recognizeToTranscript.js')

describe('recognizeToTranscript', function() {
  it('returns text', function() {
    var recognizeResult = {
      "results": [{
        "alternatives": [{
          "transcript": "1 2",
          "confidence": 0.93
        }, {
          "transcript": "3 4",
          "confidence": 0.87
        }]
      }, {
        "alternatives": [{
          "transcript": "5 6",
          "confidence": 0.93
        }]
      }]
    };
    expect(recognizeToTranscript(recognizeResult)).to.equal("1 2 5 6");
  });
});
