'use strict';

var spawn = require('child_process').spawn;
var fs = require('fs');
var debug = require('debug')('speech2cmd:record')

function record(inputFile) {
  if (fs.exists(inputFile)) {
    //TODO race condition
    debug('delete input file ' + inputFile);
    fs.unlinkSync(inputFile);
  }
  return new Promise(function(fulfill, reject) {
    var recProc = spawn("rec", ["-r", "16k", "-e", "signed-integer", "-b", "16", "-c", "1", "-d", inputFile]);
    debug('created record process');
    setTimeout(function() {
      debug('killing record process');
      recProc.kill();
      fulfill();
    }, 5000);
  });
}


module.exports = record;
