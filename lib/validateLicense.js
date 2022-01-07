'use strict'

const License = require('./License')
const LicenseError = require('./LicenseError')
const errors = require('./errors')

/**
 * @param {object} licenseData User data
 * @param {string} serial serial to validate
 * @returns {{errorCode: number, message: string}|object} validated object
 */
module.exports = (licenseData, serial) =>
{
  /* error if missing user info */
  if (!licenseData) throw errors('WINFO_MISSING')
  if (!serial) throw errors('WNOT_STRING')

  let result = null

  try {
    if(!License.checkExpireDate(licenseData.expireDate)) throw new LicenseError(errors('WLICENSE_EXPIRED'))

    const license = new License(licenseData)

    if (license.serial === serial)
    {
      return errors()
    }

    result = errors('NOT_VALID')
  } catch(error) {
    console.log("createLicense Exception" + error)
    result = error.getError()
  }

  return result
}
