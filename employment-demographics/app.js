var express = require('express');
var routes = require('./routes');
var user = require('./routes/users');
var http = require('http');
var https = require('https');
var path = require('path');
var ejs = require('ejs');
var app = express();

var BLSkey="e22450788c9042bea997421370772602";

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.bodyParser());
//app.use(express.cookieParser());

// development only
/*if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}*/

app.get('/', function(req,res){
    //var asdf = http.Client
    /*var options = {
        host: 'api.bls.gov',
        path: '/publicAPI/v2/timeseries/data/LNU02073118'
    };*/
   /* http.request(options, function(response) {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                console.log(str);
            });

        }
    ).end();
*/

    /*var options = {
        hostname: 'api.bls.gov',
        path: 'https://api.bls.gov/publicAPI/v2/timeseries/data/LNU02073118',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    https.request(options, function(response) {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                //console.log(chunk);
                str += chunk;
            });

            response.on('end', function () {
                console.log(str);
            });

        }
    ).end();
*/
    ejs.renderFile("./views/welcome.ejs",function (err, result) {
          if (!err) {
            res.end(result);
          }
          else{
            res.end('An error occurred');
            console.log(err);
          }
      }
  )
});


app.get('/login', function(req,res){

    var options = {
        hostname: 'api.bls.gov',
        path: 'https://api.bls.gov/publicAPI/v2/timeseries/data',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var str='';

    var postData = {
        'seriesid':["LNU00074600", "LNU00075570", "LNU00075580", "LNU00075585", "LNU00075590", "LNU00075595", "LNU00075600"],
        "startyear":"2016",
        "endyear":"2016",
        "registrationkey":BLSkey
    }

    const req1 = https.request(options, function(response) {
        console.log("STATUS: ${res.statusCode}");
    console.log("HEADERS: ${JSON.stringify(res.headers)}");
    response.setEncoding('utf8');
    /*res.on('data', function(chunk) {
        console.log("BODY: ${chunk}");
    });
    res.on('end', function(){
        console.log('No more data in response.');
    });*/

        response.on('data', function (chunk) {
            //console.log(chunk);
            str += chunk;
        });
        //var results = JSON.stringify(str);
        //console.log(results.Results.series[0].seriesID);


        //console.log(JSON.parse(JSON.stringify(str)));
        response.on('end', function () {
            //console.log(JSON.parse(JSON.stringify(str)));
            var results = JSON.parse(str);
            console.log(results.Results.series[0].seriesID);
            var results1 = results.Results.series;
            ejs.renderFile("./views/welcome.ejs",{ data:results1 },function (err, result) {
                    if (!err) {
                        res.end(result);
                    }
                    else{
                        res.end('An error occurred');
                        console.log(err);
                    }
                }
            )
            //console.log(str);
        });
});

    req1.on('error', function(e) {
        console.error("problem with request: ${e.message}");
});

// write data to request body
    var postData = {
        "seriesid":["LNU00074600", "LNU00075570", "LNU00075580", "LNU00075585", "LNU00075590", "LNU00075595", "LNU00075600"],
        "startyear":"2016",
        "endyear":"2016",
        "registrationkey":"e22450788c9042bea997421370772602"
    }
    req1.write(JSON.stringify(postData));
    req1.end();
    /*
    var postData = {
        'seriesid':["LNU00074600", "LNU00075570", "LNU00075580", "LNU00075585", "LNU00075590", "LNU00075595", "LNU00075600"],
        "startyear":"2016",
        "endyear":"2016",
        "registrationkey":"e22450788c9042bea997421370772602"
    }
    https.request.write(postData);
    https.request(options, function(response) {
            var str = '';




        //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                //console.log(chunk);
                str += chunk;
            });

            response.on('end', function () {
                console.log(str);
            });

        }
    ).end();
*/
    console.log(str);
    /*ejs.renderFile("./views/welcome.ejs", {data: str},function (err, result) {
            if (!err) {
                res.end(result);
            }
            else{
                res.end('An error occurred');
                console.log(err);
            }
        }
    )*/
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
