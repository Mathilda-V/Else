const HOST = 'https://www.97dui.com'
const RSA = require('./wxappRsa.js')
const { PUBLIC_KEY } = require('./constant.js')
const ss = "-----BEGIN RSA PRIVATE KEY-----MIICXQIBAAKBgQDrWeIGo13Pv4QcvslA58/hSV72ZXdvYj+8Zl+xLpsP7JaeKbjKuHZnmRQhIDr4Y2edMM8f1/3+we8aenHc3Rn2VkZ01QOeBOdB/ZPmjlWRdL9rfPSIfjxn5DPY6CEa0tJ0FPFYwcA7QsEyLj4l/pg5jRrctyD+oI+9Osaaq+5HRwIDAQABAoGBAIAzBuccyDYpGZra5h+/5kHOyLapEMUQnK1QiqGmRHsJIgZnraxnjL/j584fk1/ILiG2+6xZ6JaEJ22h8zIfEktMyj8IxEIvttAmForJBrddvSDwAxnziKpFUEj7KPfBNDNxo995rARwJc2a8yQ4uGmYxcRcs5WvMsyQvDlUs1RBAkEA9xJv97Pg5s+6qmwl2mRmaofZcwEr+R7sq+19z+TrlAQnAIgrxHlyJqzrZuEKb6SpjsnyVJ+3GPCuHBVi9LgnZwJBAPPbBSa4OLfh9jKLIV1l44iuuFiAkwl9Gg1PGGLdYjV6A86P9pXx7fXrk0RkotPILrHtX3woAtx1cnFKRsaEVSECQQCFXMdhTg/0pmYcvXmFM7JwiFmgkR5aPw4DE5NYlzlt0Pv4doghamhqZeY+xvQqJRh9AZazhO6BINDqScT7UTe7AkA+6aaukqCvcDCgYZy+B+doAAu3aZSFwizSejGEcDFCMrSAukuX687Ev35DCuOnV+IULXWRBpGWZwabi9oupT2BAkAz3yj8jpmQth0y1p2oMAICZFPH0IQh94T7J6rbTTRkwy3i98/RsswbaBoMTFOBeuHKmosWPl40Y6EI83CExs2t-----END RSA PRIVATE KEY-----"
const _mm = {
  request: function(query, param, method, resolve) {
    let url = `${HOST}${query}.do`
    wx.request({
      url: url || '',
      data: param || '',
      method: method || 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: (res)=> {
        resolve(res)
      }
    })
  },
  encrypt: function(params) {
    let astring = JSON.stringify(params)
    //astring="aaaaaa";
    let encrypt_rsa = new RSA.RSAKey()
    encrypt_rsa = RSA.KEYUTIL.getKey(PUBLIC_KEY)
    // let encStr = encrypt_rsa.encrypt(JSON.stringify(params))
    // encStr = RSA.hex2b64(encStr)
    // return encStr
    let maxLength = (((encrypt_rsa.n.bitLength() + 7) >> 3) - 11);
    // let maxLength = 117;
    let lt = "";
    let ct = "";
    if (astring.length > maxLength) {
      lt = astring.match(/.{1,117}/g);
      lt.forEach(function(entry) {
        // console.log(entry.length)
        let t1 = encrypt_rsa.encrypt(entry);
        ct += t1;
      });
      // console.log(ct);
      return RSA.hex2b64(ct);
    } else {
      let t = encrypt_rsa.encrypt(astring);
      let y = RSA.hex2b64(t);
      return y;
    }
  },
  uncrypt: function (params) {
    let encrypt_rsa = new RSA.RSAKey()
    // console.log(encrypt_rsa);
    encrypt_rsa = RSA.KEYUTIL.getKey(ss)
    // console.log(encrypt_rsa);
    var maxLength = ((encrypt_rsa.n.bitLength() + 7) >> 3);
    
    // var maxLength = 128;
    // console.log(params);
    var astring = RSA.b64tohex(params);
    
    console.log(astring)
    //var t1 = encrypt_rsa.decrypt(astring);
    //console.log(t1);
    var ct = "";
    if(astring.length > maxLength) {
      var lt = astring.match(/.{1,128}/g);
      lt.forEach(function (entry) {
        console.log(entry);
        var t1 = encrypt_rsa.decrypt(entry);
        console.log(t1)
        ct += t1;
      });
      return ct;
    }else{
      var y = encrypt_rsa.decrypt(astring);
      return y;
    }
  }
}
module.exports = _mm