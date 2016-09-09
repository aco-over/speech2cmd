'use strict'
var fs = require('fs');
var _ = require('lodash');

// Map text to commands according to the phraseMap
// returns - list of commands
exports.mapTextToCmds = function(text, phraseMap) {
  var words = _.words(_.toLower(text));
  var phrases = _.keys(phraseMap);
  return mapPhrase(words);

  function mapPhrase(words) {
    if (words.length == 0) {
      return [];
    }

    var matchedPhrase = _.find(phrases, function(phrase) {
      return exports.isPrefix(words, _.words(phrase));
    });

    var command = null;

    if (!matchedPhrase) {
      // No match found. Use default command.
      matchedPhrase = words[0];
      command = defaultCommand(matchedPhrase);
    } else {
      command = phraseMap[matchedPhrase];
    }

    var remainingWords = _.drop(words, _.words(matchedPhrase).length);
    return _.concat(command, mapPhrase(remainingWords));
  }
}

function defaultCommand(word) {
  return word;
}

exports.isPrefix = function(collection, prefix) {
  if (collection.length < prefix.length) {
    return false;
  }

  return _.isEqual(_.take(collection, prefix.length), prefix);
}
