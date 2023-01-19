'use strict';
const Service = require('egg').Service;
class fontFun extends Service {
  async articleGroup (data,technology) {
    let totalObject = {}
    technology.forEach(element => {
      totalObject[element.id] = 0
    });
    for(let i = 0; i < data.length; i++) {
      totalObject[data[i].technologyid]++
    }
    return totalObject
  }
}
module.exports = fontFun;
