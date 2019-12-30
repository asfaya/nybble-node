var config = require('../config/config');
const superagent = require('superagent');
const jsonp = require('superagent-jsonp');

class weatherService {
    async getWeather(lat, long) {

        let url = `https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_7days&latitude=${ lat }&longitude=${ long }&oneobservation=true&apiKey=${ config.weatherKey }`;

        return (await superagent
            .get(url)
            .set('Referer', 'http://localhost:4200/')
            .use(jsonp({
                callbackName: 'jsonpcallback'
            })));
    }
}

module.exports = new weatherService();