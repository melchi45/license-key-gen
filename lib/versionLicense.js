'use strict'

const Version = require('./version')

/**
  * @returns {object} version of license library
 */
module.exports = () =>
{
  console.log("version=" + Version.version);
  return Version.version
}
