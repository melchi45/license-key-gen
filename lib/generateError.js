'use strict'

const License = require('./License')
const LicenseError = require('./LicenseError')
const errors = require('./errors')
const e = require('express')

/**
 * @param {object} errorData error name
 * @returns {object} generated error message
 */
module.exports = (errorData) =>
{
  /* error if missing user info */
  if (!errorData) throw errors('WINFO_MISSING')

  let result = null

  try {
    // if(!License.checkExpireDate(licenseData.expireDate)) throw new LicenseError(errors('WLICENSE_EXPIRED'))

    // const license = new License(licenseData)

    // if (license.serial === serial)
    // {
    //   return errors()
    // }

    const error = new LicenseError(errors(errorData))

    result = error.getError()
  } catch(error) {
    console.log("createLicense Exception" + error)
    result = error.getError()
  }

  return result
}
