/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
const cloud = require("wx-server-sdk");
var request = require('request-promise');
cloud.init();
const db = cloud.database({
  env: 'my-webify-app-0g9xwgxn5bf25b1b'
});
const { OPENID } = cloud.getWXContext({
  env: 'my-webify-app-0g9xwgxn5bf25b1b'
});
exports.main = async (event) => {

  var flag = event.way
  // your code ...
  //  const ress = await db.collection("users").where({}).get();
  // const res = await urllib.request('https://aip.baidubce.com/oauth/2.0/token', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   dataType: "json",
  //   data: {
  //     grant_type:'client_credentials',
  //     client_id:'ULAgr7A1g4xijFpD5HKlna54',
  //     client_secret:'KCIEBbwkTpycPvniGxZyeoLn4tqBtDqU'
  //   }
  // })
  // return new Promise((resolve, reject) => {
  //   try {
  //     request({
  //       method: 'POST',
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //       body: JSON.stringify(
  //         {
  //           "grant_type":'client_credentials',
  //           "client_id":'ULAgr7A1g4xijFpD5HKlna54',
  //           "client_secret":'KCIEBbwkTpycPvniGxZyeoLn4tqBtDqU'
  //         }
  //         ),
  //       url: "https://aip.baidubce.com/oauth/2.0/token",
  //     }, function (error, response, body) {
  //       if (error) {
  //         return reject(error);
  //       }
  //       return resolve(JSON.parse(body));
  //     })
  //   } catch (e) {
  //     return reject(e)
  //   }
  // });
  if (flag == 'image') {
    var ak = await getak();
    ak = ak.body.split('"access_token":"')[1].split('","')[0]
    var image = encodeURIComponent(await getbase64(event.fileid))
    return new Promise((resolve, reject) => {
      try {
        request({
          method: 'POST',
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
          body:"image="+image
          ,
          url: "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate?access_token="+ak,
        }, function (error, response, body) {
          if (error) {
            return reject(error);
          }
          return resolve(response);
        })
      } catch (e) {
        return reject(e)
      }
    });
  }

};


async function getak() {
  var t = new Promise((resolve, reject) => {
    try {
      request({
        method: 'GET',
        headers: {
          "content-type": "application/json",
        },
        url: "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=SNwYjt4yIGOxeEFaO7T25Kul&client_secret=ZEEPPLFNsdCDkVymTlPsIHVad1bQPl8q",
      }, function (error, response, body) {
        if (error) {
          return reject(error);
        }
        return resolve(response);
      })
    } catch (e) {
      return reject(e)
    }
  });

  return t;
}

async function getbase64(fileid){
  const res = await cloud.downloadFile({
    fileID: fileid,
  })
  return res.fileContent.toString('base64');
}