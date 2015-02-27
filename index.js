var request = require('request');
var cheerio = require('cheerio');
var crypto = require('crypto');

var Crawler = function(originUrl) {
  this.originUrl = originUrl;
};

Crawler.prototype = {
  constructor: Crawler,
  getIndex: function() {
    var self = this;
    request.get(self.originUrl, function(error, res, body) {
      if (!error && res.statusCode == 200) {
        //console.log(body); // 打印google首页
        self.parseIndex(body);
      } else {
        console.error(error);
      }
    })
  },

  parseIndex: function(body) {
    var self = this;
    var $ = cheerio.load(body);
    $("#left .box").each(function(i, e) {
      var date = $(e).find('.titlebar h2').attr('title');
      var dateText = $(e).find('.titlebar h2').text();
      
      console.log('于' + dateText + '有以下比赛:');

      $(e).find('.content li').each(function(iLi, iE) {
        var cat = $(iE).attr('label');
        var info = $(iE).text().split(' ');
        var time = info[0];
        var content = info[1];
        var zhiboLinks = $(iE).find('a').eq(0).attr('href');
        var zhiboTitle = $(iE).find('a').eq(0).text();
        
        console.log(time + '有' + cat + '节目,' + content + ',可以在' + zhiboTitle + '上观看');

        var md5 = crypto.createHash('md5');
        md5.update(date + content);
        var hashKey = md5.digest('hex');
        console.log(hashKey);

        var _md5 = crypto.createHash('md5');
        _md5.update(date + content + zhiboTitle);
        var hashUpdateKey = _md5.digest('hex');
        console.log(hashUpdateKey);
      })
    });
  }
};

var crawler = new Crawler('http://zhibo8.com');
crawler.getIndex();