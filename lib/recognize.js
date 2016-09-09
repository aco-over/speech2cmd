// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START app]
// [START import_libraries]
var google = require('googleapis');
var async = require('async');
var fs = require('fs');
var debug = require('debug')('speech2cmd:recognize');

// Get a reference to the speech service
var speech = google.speech('v1beta1').speech;
// [END import_libraries]




// [START authenticating]
function getAuthClient(callback) {
  // Acquire credentials
  google.auth.getApplicationDefault(function(err, authClient) {
    if (err) {
      return callback(err);
    }

    // The createScopedRequired method returns true when running on GAE or a
    // local developer machine. In that case, the desired scopes must be passed
    // in manually. When the code is  running in GCE or a Managed VM, the scopes
    // are pulled from the GCE metadata server.
    // See https://cloud.google.com/compute/docs/authentication for more
    // information.
    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
      // Scopes can be specified either as an array or as a single,
      // space-delimited string.
      authClient = authClient.createScoped([
        'https://www.googleapis.com/auth/cloud-platform'
      ]);
    }

    return callback(null, authClient);
  });
}
// [END authenticating]

// [START construct_request]
function prepareRequest(inputFile, config, callback) {
  fs.readFile(inputFile, function(err, audioFile) {
    if (err) {
      return callback(err);
    }
    var encoded = new Buffer(audioFile).toString('base64');
    var payload = {
      config: config,
      audio: {
        content: encoded
      }
    };
    return callback(null, payload);
  });
}
// [END construct_request]

function recognize(inputFile, config) {
  var requestPayload;

  var promise = new Promise(function(fulfill, reject) {

    async.waterfall([
      function(cb) {
        prepareRequest(inputFile, config, cb);
      },
      function(payload, cb) {
        requestPayload = payload;
        getAuthClient(cb);
      },
      // [START send_request]
      function sendRequest(authClient, cb) {
        speech.syncrecognize({
          auth: authClient,
          resource: requestPayload
        }, function(err, result) {
          if (err) {
            return cb(err);
          }
          debug("result:" + JSON.stringify(result));
          cb(null, result);
        });
      }
      // [END send_request]
    ], function(err, result) {
      if (err) {
        reject(err);
      } else {
        fulfill(result);
      }
    });
  });
  return promise;
}



module.exports = recognize;
