#!/usr/bin/env node

'use strict';

var ArgumentParser = require('argparse').ArgumentParser;
var debug = require('debug')('speech2cmd');
var notifier = require('node-notifier');
var _ = require('lodash')
var fs = require('fs');
var recognize = require('./lib/recognize');
var record = require('./lib/record.js');
var context = require('./lib/context.js');
var type = require('./lib/type.js');
var recognizeToTranscript = require('./lib/recognizeToTranscript.js');

function parseArgs() {
  var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Convert speech to commands'
  });

  parser.addArgument(
    ['-c', '--context'], {
      help: 'json file to map phrases into commands',
      required: true
    }
  );
  return parser.parseArgs();
}

function main(args) {
  var tmpFile = "/tmp/speech2cmd.raw";
  var phraseMap = JSON.parse(fs.readFileSync(args['context']));
  debug(JSON.stringify(phraseMap));

  debug('listen');
  notifier.notify({
    title: "speech2cmd",
    message: "listen"
  });
  record(tmpFile)
    .then(function() {
      debug('convert to text');
    })
    .then(function() {
      var config = {
        encoding: 'LINEAR16',
        sampleRate: 16000,
        speechContext: {
          phrases: _.keys(phraseMap),
        }
      };
      return recognize(tmpFile, config);
    })
    .then(function(result) {
      return recognizeToTranscript(result, phraseMap);
    })
    .then(function(result) {
      debug('text:' + result);
      return result;
    })
    .then(function(result) {
      var commands = context.mapTextToCmds(result, phraseMap);
      var text = _.join(commands, " ");
      // TODO Only command is text
      debug('type:' + text);
      type(text);
    })
    .catch(function(error) {
      console.error("error:", error);
      console.error("stack:", error.stack);
      debug('error:' + error);
    });
}


if (module === require.main) {
  var args = parseArgs();
  main(args);
}
