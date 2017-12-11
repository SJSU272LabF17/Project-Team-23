var express = require('express');
var routes = require('./routes');
var user = require('./routes/users');
var http = require('http');
var https = require('https');
var path = require('path');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var app = express();

// BLS Key. Necessary for communicating with V2 Version API.
// 500 API Hits per-day. Replace with new one.
// Registration Link for V2 - https://data.bls.gov/registrationEngine/
var BLSkey="e22450788c9042bea997421370772602";
var hostname = "api.bls.gov";
var multiSeriesPath = "https://api.bls.gov/publicAPI/v2/timeseries/data";


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Initial Landing page when the server runs. Sidebar - HOME - Population - With a disability. ReferPage: welcome.ejs
app.get('/', function(req,res){

    // Required REST API Headers for the RESTful Call.
    var headers = {
        hostname: hostname,
        path: multiSeriesPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
  
    // Population - With a disability. Gender (0-1), Ethnicity (2-5), Age (6-12).
    var populationData = {
        'seriesid':["LNU01075630", "LNU01075704", "LNU00075557", "LNU00075558", "LNU00075560", "LNU00075559", "LNU00074600", "LNU00075570", "LNU00075580", "LNU00075585", "LNU00075590", "LNU00075595", "LNU00075600"],
        "startyear":"2016",
        "endyear":"2016",
        "registrationkey":BLSkey
    }

    httpRESTRequest(headers, populationData, res, "welcome");
});

// Sidebar - EMPLOYMENT. ReferPage: employment.ejs
app.get('/employment',function(req,res){

    ejs.renderFile("./views/employment.ejs",function (err, result) {
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

// Sidebar - EDUCATION. ReferPage: education.ejs
app.get('/education',function(req,res){

    // Required REST API Headers for the RESTful Call.
    var headers = {
        hostname: hostname,
        path: multiSeriesPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };


    // Education - With a disability. Pie Chart (0-3), Side-by-side Bar Chart (4-11).
    var educationData = {
        'seriesid':["LNU00078210", "LNU00078208", "LNU00078209", "LNU00078207", "LNU02078210", "LNU02078208", "LNU02078209", "LNU02078207", "LNU03078210", "LNU03078208", "LNU03078209", "LNU03078207"],
        "startyear":"2016",
        "endyear":"2016",
        "registrationkey":BLSkey
    }

    httpRESTRequest(headers, educationData, res, "education");

});

// Sidebar - SALARY. ReferPage: salary.ejs
app.get('/salary', function(req,res){

    ejs.renderFile("./views/salary.ejs",function (err, result) {
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

// Sidebar - JOB. ReferPage: jobprediction.ejs
app.get('/job', function(req, res) {

    ejs.renderFile("./views/jobprediction.ejs", function(err, result) {
        if (!err) {
            res.end(result);
        } else {
            res.end('An error occurred');
            console.log(err);
        }
    })
});

// Express Server port listener.
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Call this method to make a RESTful Web Service call to the provided - Headers & API Body Data.
// pageName - refers to which page and graph should be rendered.
function httpRESTRequest(headers, apiBodyData, res, pageName) {

    // To store the JSON Response from the BLS Website.
    var jsonResponse = "";

    // HTTP Request object directed to the Endpoint API Headers. Also, handles the JSON Response from the server.
    const httpRequest = https.request(headers, function (response) {

        // console.log("HTTP Response Status: ${response.statusCode}");
        // console.log("HTTP JSON Response: ${JSON.stringify(res.headers)}");

        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            jsonResponse += chunk;
        });


        response.on('end', function () {
            var results = JSON.parse(jsonResponse);
            console.log(results.Results.series[0].seriesID);
            var results1 = results.Results.series;
            console.log(results1);

            renderPage(res, results1, pageName);

        });
    });

    httpRequest.write(JSON.stringify(apiBodyData)); // Writes the JSON Body data on the open connection.
    httpRequest.on('error', function (e) {
        console.error("problem with request: ${e.message}");
    });

    httpRequest.end(); // Closes the HTTP Request connection.
}

// Call this method to render HOME page with graphs.
function renderPage(res, graphResult, pageName) {

    var targetPage = "./views/" + pageName + ".ejs";
    ejs.renderFile(targetPage,{ data: graphResult},function (err, result) {
            if (!err) {
                res.end(result);
            }
            else{
                res.end('An error occurred');
                console.log(err);
            }
        }
    )
}

app.get('/job', function(req, res) {


    var spawn = require('child_process').spawn,
        py    = spawn('py', ['ml_model_evaluate.py']),
        data = [0,1],
        dataString = '';

    py.stdout.on('data', function(data){
        dataString += data.toString();
    });
    py.stdout.on('end', function(){
        console.log('Sum of numbers=',dataString);
        ejs.renderFile("./views/jobprediction.ejs",{data:dataString} ,function(err, result) {
            if (!err) {
                res.end(result);
            } else {
                res.end('An error occurred');
                console.log(err);
            }
        })
    });
    py.stdin.write(JSON.stringify(data));
    py.stdin.end();

}).post('/job', function(req, res) {

    console.log(req.body.profession);
    console.log(req.body.gender);

    var spawn = require('child_process').spawn,
        py    = spawn('py', ['ml_model_evaluate.py']),
        data = [req.body.gender,req.body.profession],
        dataString = '';

    py.stdout.on('data', function(data){
        dataString += data.toString();
    });
    py.stdout.on('end', function(){
        console.log('Sum of numbers=',dataString);
        ejs.renderFile("./views/jobprediction.ejs",{data:dataString} ,function(err, result) {
            if (!err) {
                res.end(result);
            } else {
                res.end('An error occurred');
                console.log(err);
            }
        })
    });
    py.stdin.write(JSON.stringify(data));
    py.stdin.end();
    console.log(dataString);

});

app.get('/login', function(req,res){

    /*var spawn = require('child_process').spawn,
       py    = spawn('py', ['ml_model_evaluate.py']),
       data = [1,3],
       dataString = '';
   py.stdout.on('data', function(data){
     dataString += data.toString();
   });
   py.stdout.on('end', function(){
     console.log('Sum of numbers=',dataString);
   });
   py.stdin.write(JSON.stringify(data));
   py.stdin.end();*/



    ejs.renderFile("./views/login.ejs",function (err, result) {
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