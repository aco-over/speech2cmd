'use strict'

var _ = require('lodash');

// Convert google speech result to text transcript
function recognizeToTranscript(result, phraseMap) {
  // Sequential list of transcription results corresponding to sequential portions of audio.
  var results = result['results'];
  var transcriptList = _.map(results, function getTranscript(e) {
    var alternatives = e['alternatives'];
    // Pick first alternative.
    // TODO sort by confidence first
    return alternatives[0]['transcript'];
  });
  return _.join(transcriptList, " ");
}

module.exports = recognizeToTranscript;
