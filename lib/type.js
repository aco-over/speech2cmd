'use strict';

var exec = require('child_process').exec;
var _ = require('lodash')

function charToHexString(char) {
  return "0x" + char.charCodeAt(0).toString(16)
}

function xdotool(line) {
  var hexStrings = _.map(line, charToHexString);
  var cmd = "xdotool key " + _.join(hexStrings, " ");
  console.log("run cmd: " + cmd);
  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      throw "Failed on command " + cmd;
    }
  });
}

function type(text) {
  xdotool(text);
}

module.exports = type;
