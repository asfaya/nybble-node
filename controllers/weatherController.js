var weatherService = require('../services/weatherService');
var moment = require('moment');

const LoggerService = require('../services/loggerService');
const logger = new LoggerService('nybble-node');

exports.weather_get = async (req, res, next) => {
    try {
        let lat = req.params.lat;
        let long = req.params.long;

        logger.info(`New weather get (Lat: ${ lat } / Long: ${ long })`); 
        
        var weatherResponse = await weatherService.getWeather(lat, long);

        if (weatherResponse) {
            logger.info(`Got weather from service`, weatherResponse); 
            var weather = JSON.parse(weatherResponse.text);
            logger.info(`Parsed weather information`, weather); 

            var forecasts = [];
            if (weather.forecasts && weather.forecasts.forecastLocation) {
                var momentDate = moment.utc();
    
                for (let i = 0; i < 3; i++) {
                    // Get first forecast for date
                    let forecast = weather.forecasts.forecastLocation.forecast.find(f => f.utcTime.startsWith(momentDate.format('YYYY-MM-DD')));
                    if (forecast)
                        forecasts.push(forecast);
                    momentDate.add(1, 'days');
                }
            }
            res.json(forecasts);
        } else {
            logger.info(`Weather for lat ${ lat } and long ${ long } not found`);
            res.status(404).json({ message: `Weather for lat ${ lat } and long ${ long } not found` });
        }
    } catch (e) {
        logger.error(`Exception getting weather from service`, e);
        res.status(400).json(e);
    }
}
