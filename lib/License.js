'use strict'

require('date-utils');
const LicenseError = require('./LicenseError')
const md5 = require('md5')
const crypt = require('./encrypt-decrypt')
const errors = require('./errors')
const support = require('./supported')

/**
 * @class License
 * @type {module.License}
 */
module.exports = class License
{
  /**
   * @constructor
   * @param {object} info User details
   * @param {string} prodCode Product code
   * @param {string} appVersion Application version
   * @param {string} expireDate expire date
   * @param {string} model Operating System type
   */
  constructor ({ info, prodCode, appVersion = '1.0', expireDate, model, fingerprint } = {})
  {
    //
    if (!info || typeof info !== 'object') throw new LicenseError(errors('WINFO_MISSING'))
    if (!prodCode) throw new LicenseError(errors('WPRODCODE_MISSING'))
    // setters
    this._info = info;
    this._prodCode = prodCode;
    this._appVersion = appVersion;
    this._expireDate = expireDate;
    this._clientFingerprint = fingerprint;
    this._model = model;
    this.id = null;
    this.serial = null;
    this.updateSerial();
  }

  /**
   * @param {object} info User details
   */
  set info (info)
  {
    if (info)
    {
      this._info = info
      this.updateSerial()
    }
  }

  /**
   * @param {string} prodCode Product code
   */
  set prodCode (prodCode)
  {
    if (prodCode)
    {
      this._prodCode = prodCode
      this.updateSerial()
    }
  }

  /**
   * @param {string} appVersion Application version
   */
  set appVersion (appVersion)
  {
    if (appVersion)
    {
      this._appVersion = appVersion
      this.updateSerial()
    }
  }

  /**
   * @param {string} modelType Operating System type
   */
     set expireDate (expireDate)
     {
       if (expireDate)
       {
         this._expireDate = expireDate
         this.updateSerial()
       }
     }

  /**
   * @param {string} modelType Operating System type
   */
  set model (modelName)
  {
    if (modelName)
    {
      this._model = modelName
      this.updateSerial()
    }
  }

  /**
   * @param {string} fingerprint Clients fingerprint
   */
     set clientFingerprint (fingerprint)
     {
       if (fingerprint)
       {
         this._clientFingerprint = fingerprint
         this.updateSerial()
       }
     }

  /**
   * update serial number
   */
  updateSerial ()
  {
    if(!checkExpireDate(this._expireDate)) throw new LicenseError(errors('NOT_VALID_DATE'))
    this.id = generateHash(this._info, this._prodCode, this._appVersion, this._expireDate, this._model, this._clientFingerprint)
    this.serial = createSerial(this.id)
  }

  /**
   * @returns {string} returns serial generated serial number
   */
  getSerial ()
  {
    return this.serial
  }

  static checkExpireDate(date)
  {
    return checkExpireDate(date)
  }
}

/**
 * @param {string} id id
 * @returns {*} returns generated serial
 */
const createSerial = (id) =>
{
  return generateSerial(id)
}

const checkExpireDate = (date) =>
{
  if(!date) return false;

  const currentDateTimeClock = Math.floor(new Date().getTime() /1000);
  const expireDateTimeClock = Math.floor(new Date(date).getTime() / 1000);

  // timestamp in milliseconds
  console.log("current timestamp=" + currentDateTimeClock + ", " +
              "target timestamp=" + expireDateTimeClock);

  if(expireDateTimeClock < currentDateTimeClock) {
    return false;
  }

  return true;
}

/**
 * @param {object} info User details
 * @param {string} prodCode Product code
 * @param {string} appVersion Application version
 * @param {string} modelName Operating System type
 * @returns {*} returns generated serial
 */
const generateHash = (info, prodCode, appVersion, expireDate, modelName, clientFingerprint) =>
{
  if(!checkExpireDate(expireDate)) throw new LicenseError(errors('WLICENSE_EXPIRED'))
  //
  const userInfo = []
  //
  Object.keys(info).forEach((key) =>
  {
    const val = info[key]
    userInfo.push(val)
  })
  //
  const str = userInfo.join()
  const reg = new RegExp('[^0-9a-zA-Z]+', 'g')
  info = str.replace(reg, '')
  //
  const infoHash = md5(info.toUpperCase()).toUpperCase()
  //
  const regVr = new RegExp('\\.+', 'g')
  const appVr = appVersion.replace(regVr, '')
  const date = expireDate.replace(reg, '')
  const fingerprint = clientFingerprint.replace(reg, '')
  //
  const uniqueModelID = md5(generateModelHash(modelName)).toUpperCase()
  //
  const userInfoStr = infoHash + ":" + prodCode + ":" + appVr + ":" + date + ":" + uniqueModelID + ":" + fingerprint

  console.log("input info. str = " + userInfoStr);
  console.log("result hash = " + md5(userInfoStr));
  return (md5(userInfoStr)).toUpperCase()
}

/**
 * create encrypted string
 * @param {string} id id
 * @returns {*} return chunk serial
 */
const generateSerial = (id) =>
{
  const regKey = crypt.encryptString(id).toString()
  console.log("decypt str = " + crypt.decryptString(regKey).toString().toLowerCase())
  return chunkString(regKey, 5)
}

/**
 * @param {string} str string value
 * @param {int} length length to chunck
 * @returns {string} chunk serial
 */
const chunkString = (str, length) =>
{
  const regEx = new RegExp('.{1,' + length + '}', 'g')
  const newStr = str.match(regEx)
  // trim extra
  if (newStr.length > 6) newStr.pop()
  return newStr.join('-').toUpperCase()
}

/**
 * Create merge system params
 * @param {string} modelName Operating System type
 * @returns {string} returns merged string
 */
const generateModelHash = (modelName) =>
{
  let modelObj = support[modelName]

  let modelHash = ''
  if (modelObj)
  {
    const strObj = modelObj.model + ":" + modelObj.version + ":" + modelObj.type
    modelHash = strObj.replace('.', '').replace('-', '').replace('_', '').toUpperCase()
  }
  return modelHash
}
