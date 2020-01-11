var Crypto = require('cryptojs/cryptojs.js').Crypto;

function RdWXBizDataCrypt(appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

RdWXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode ：使用 CryptoJS 中 Crypto.util.base64ToBytes()进行 base64解码
  var encryptedData = Crypto.util.base64ToBytes(encryptedData);
  
  var key = Crypto.util.base64ToBytes(this.sessionKey);
  var iv = Crypto.util.base64ToBytes(iv);
  // console.log(this.sessionKey);
  // 对称解密使用的算法为 AES-128-CBC，数据采用PKCS#7填充
  var mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);

  try {
    // 解密
    var bytes = Crypto.AES.decrypt(encryptedData, key, {
      asBpytes: true,
      iv: iv,
      mode: mode
    });
    // console.log(bytes);
    var decryptResult = JSON.parse(bytes);

  } catch (err) {
    console.log(err)
  }

  if (decryptResult.watermark.appid !== this.appId) {
    console.log(err)
  }

  return decryptResult
}

RdWXBizDataCrypt.prototype.decryptData256 = function (encryptedData, key) {
  var CryptoJS = require('cryptojs/crypto-js.js');
  // console.log(encryptedData);
  key = CryptoJS.enc.Utf8.parse(key.substr(0,16));
  var options={
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }

  //console.log(encryptedData.toLowerCase());
  var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedData);
  //  console.log('parase',encryptedHexStr);
  var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  //  console.log('parase', encryptedBase64Str)
  var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, options);
  
  var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
  // console.log(decryptedStr);
  return decryptedStr;
}

module.exports = RdWXBizDataCrypt