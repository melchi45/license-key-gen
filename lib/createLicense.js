'use strict'

const License = require('./License')
const LicenseError = require('./LicenseError')
const errors = require('./errors')
const e = require('express')

/**
 * @param {object} licenseData User data
 * @returns {object} generated serial
 */
module.exports = (licenseData) =>
{
  let result = null
  try {
    if(!License.checkExpireDate(licenseData.expireDate)) throw new LicenseError(errors('NOT_VALID_DATE'))

    const license = new License(licenseData)

    result = errors()
    result.license = license.getSerial()
  } catch (error) {
    console.log("createLicense Exception" + error)
    result = error.getError()
  }
  return result
}
