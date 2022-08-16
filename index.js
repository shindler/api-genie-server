// *******************************************
// Run a fake API server that @angular/cli will proxy to all APi calls
// *******************************************
let connect = require('connect');
let http = require('http');

let args = require('yargs').argv;

let apiGenie = require('api-genie');
let bodyParser = require('body-parser');

let devConfig = {
  apiGenie: {
    mocksMap: [
      {
        testRegExp: /^\/api\//i,
        mocksRootPath: 'example/mocks/api/'
      },
    ],
    subsetTriggeringHeaderValueRegExp: /^.*/i,
    beVerbose: args.hasOwnProperty('verbose') ? args.verbose : false
  },
  connect: {
    port: args.port || 5201
  }
};

// #########################
// #########################
// #########################

// 1. start connect webserver that will be utilized by apiGenie
let app = connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// 2. configure aoiGenie and add it as connect middleware
let apiGenieConfiguration = devConfig.apiGenie;

if (args.useSubset) {
  apiGenieConfiguration.forcedSubset = args.useSubset;
}

app.use(apiGenie(apiGenieConfiguration));

// 3. start the server
http.createServer(app).listen(devConfig.connect.port);
