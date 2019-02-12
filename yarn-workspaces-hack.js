// Run lifecycle scripts for all submodules.
//
// yarn doesn't automatically run "prepare" or other lifecycle scripts for
// submodules. This is problematic because we need to run "prepare" to compile
// TypeScript code.
//
// This is an acknowledged deficiency in yarn, see https://github.com/yarnpkg/yarn/issues/3911
//
// Hopefully we can remove this script in the future.

"use strict";

var bluebird = require("bluebird");
var glob = bluebird.promisify(require("glob"));
var process = require("process");
var yarn = require.resolve("yarn/bin/yarn.js");

var packageJson = require("./package.json");

bluebird.resolve(packageJson.workspaces.packages || [])
    .map(function (pattern) {
        return glob(pattern);
    })
    .reduce(function (prev, cur) {
        return prev.concat(cur);
    }, [])
    .mapSeries(function (workspacePath) {
        console.info("\nBuilding " + workspacePath + ".");
        return fork(yarn, [], {cwd: workspacePath});
    })
    .then(function () {
        process.exit(0);
    }, function (reason) {
        console.error(reason);
        process.exit(1);
    });

var _fork = require("child_process").fork;

function fork(modulePath, args, options) {
    return new Promise(function (resolve, reject) {
        var process = _fork(modulePath, args, options);
        process.once("exit", function (code, signal) {
            if (code == null) {
                reject("Exited due to signal " + signal + ".");
            } else if (code === 0) {
                resolve();
            } else {
                reject("Exited with error code " + code + ".");
            }
        });
    });
}