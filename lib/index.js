'use strict'
//
var validateLicense = require('./validateLicense')
var createLicense = require('./createLicense')
var generateError = require('./generateError')
var version = require('./versionLicense')
//
module.exports = { validateLicense, createLicense, version, generateError }
