const errors = require('./errors')

class LicenseError extends Error {
  constructor(err, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LicenseError)
    }

    this.errObject = err
    this.code = err.errorCode
    this.message = err.message
  }

  getError = () => {
    return this.errObject
  }
}

module.exports = LicenseError