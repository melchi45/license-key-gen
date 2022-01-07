'use strict'

/**
 * @param {string} err error description
 * @returns {{errorCode: number, message: string}} returns error object
 */
module.exports = (err = 0) =>
{
  let message
  let errNum = 0

  if (err)
  {
    // find err
    const errorTypes = {
      OK: 0,
      WINFO_MISSING: 1000,
      WPRODCODE_MISSING: 1002,
      WNOT_STRING: 1004,
      WLICENSE_FAILED: 1008,
      WLICENSE_EXPIRED: 1009,
      WUNKNOWN: 1010,
      ENCRYPT_ERROR: 1012,
      DECRYPT_ERROR: 1014,
      NOT_VALID: 2006,
      NOT_VALID_PRODCODE: 2007,
      NOT_VALID_DATE: 2008,
      NOT_VALID_FINGERPRINT: 2009
    }
    errNum = errorTypes[err]
  }

  const errorObject = { errorCode: errNum, message: '' }

  switch (errNum)
  {
  case 0:
    message = 'ok'
    break
  case 1000:
    message = 'user info missing'
    break
  case 1002:
    message = 'product code missing'
    break
  case 1004:
    message = 'license must be a string'
    break
  case 1008:
    message = 'no encryption key provided'
    break
  case 1009:
    message = 'license expired'
      break
  case 1010:
    message = 'license generation failed'
    break
  case 1012:
    message = 'encryption error'
    break
  case 1014:
    message = 'decryption error'
    break
  case 2006:
    message = 'license not valid'
    break
  case 2007:
    message = 'require product is not valid'
    break
  case 2008:
    message = 'require date is not valid'
    break
  case 2009:
    message = 'require fingerprint is not valid'
    break
  default:
    message = 'no idea'
  }
  errorObject.message = message
  return errorObject
}
