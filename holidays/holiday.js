const axios = require('axios');
const cheerio = require('cheerio');
const fs = require("fs")
const request = require('request');
const util = require('node:util');
const path = require('path');

const req = util.promisify(request);

var data = {}

const readFile = async filePath => {
    try {
      const data = await fs.promises.readFile(filePath, 'utf8')
      return data
    }
    catch(err) {
      console.log(err)
    }
}


const getHoliday = ({year,data})=>{
    var y = year
    var d = data
    return new Promise((resolve, reject) => {
        try {
            var months = [1,2,3,4,5,6,7,8,9,10,11,12]
            months.map(async(item,idx)=>{
                var url = `https://www.india.gov.in/calendar?date=${year}-${item}`;
                var options = {
                    'method': 'GET',
                    'url': url,
                    'headers': {
                    }
                };
                var resData = await req(options)
                var j = item
                var y = year
                // console.log(resData.body)
                const $ = cheerio.load(resData.body);
                // if(!$(`a[title="Navigate to next month"]`)[0]){
                //     resolve({err:"Navigate to next month not found"})
                //     return
                // }
                // var next = $(`a[title="Navigate to next month"]`)[0].attribs.href
                if(!d.hasOwnProperty(y)){
                    d[y] = {}
                }
                var countDays = 0
                for(var i =1;i<=31;i++){
                    countDays = i 
                    const holiday = $(`td[data-day-of-month="${i}"]>div.inner>div.item>div.view-item-calendar>div.calendar>div.contents>div.views-field>span.field-content>div.redCal`).text()
                    const rest = $(`td[data-day-of-month="${i}"]>div.inner>div.item>div.view-item-calendar>div.calendar>div.contents>div.views-field>span.field-content>div.greenCal`).text()
                    if(holiday!=""||rest!=""){
                        if(!d[y].hasOwnProperty(j)){
                            d[y][j] = {}
                        }
                        if(!d[y][j].hasOwnProperty(i)){
                            d[y][j][i]={}
                        }
                        d[y][j][i] = {
                            restricted:rest,
                            mandatory:holiday
                        }
                    }
                }
                fs.writeFile(path.join(__dirname,"..","backend","app","data","holiday.json"), JSON.stringify(data,null,4),(err)=>{
                    if(err){
                        console.log(err)
                    }
                    
                    if(item==12 && countDays==31){
                        console.log(`Done ${year}: for all months.`)
                        resolve("done")
                    }
                });
            })
        } catch (error) {
            reject(error)
        }
    });
}

(()=>{
    var currentYear = new Date().getFullYear();
    var totalYearsToGet = 2
    var get = []
    for (var i=0;i<totalYearsToGet;i++){
        console.log(currentYear+i)
        get.push(getHoliday({year:currentYear+i,data}))
    }
    Promise.all(get).then((values) => {
        console.log(values);
        console.log(`Done For ${totalYearsToGet} year`)
    });

})()
