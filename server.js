const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var routes = require('./routes/api/public');
const LoggerService = require('./services/loggerService');

const logger = new LoggerService('nybble-node');

const app = express();
const port = 3000;

app.use(cors());

// Configure body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add routes
app.use('/api', routes);

// Start server
app.listen(port, () => { 
    logger.info(`Nybble Node Challenge listening on port ${ port }!`)
});
