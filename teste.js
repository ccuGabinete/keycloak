var x = require("./token.json");
var base64 = require("base-64");
var utf8 = require("utf8");
// console.log(base64.decode(x.access_token));


const parseJwt = (token) => {
    try {
      return JSON.parse(base64.decode(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };


  console.log(parseJwt(x.access_token))


  