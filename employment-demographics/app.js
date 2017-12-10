var express = require('express');
var routes = require('./routes');
var user = require('./routes/users');
var http = require('http');
var https = require('https');
var path = require('path');
var ejs = require('ejs');
var app = express();

// BLS Key. Necessary for communicating with V2 Version API.
// 500 API Hits per-day. Replace with new one.
// Registration Link for V2 - https://data.bls.gov/registrationEngine/
var BLSkey="e22450788c9042bea997421370772602";
var hostname = "api.bls.gov";
var multiSeriesPath = "https://api.bls.gov/publicAPI/v2/timeseries/data";

// All Environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Initial Landing page when the server runs. - HOME - Population - With a disability.
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

    httpRESTRequest(headers, populationData, res, "home");
});

// Sign-up/ Login page -> Login - To register in the website.
app.get('/login', function(req,res){

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

// Side-bar -> EMPLOYMENT STATUS - Employment Status for Population - With a disability.
app.get('/employment', function(req, res) {

    ejs.renderFile("./views/employment.ejs", function (err, result) {
        if (!err) {
            res.end(result);
        }
        else {
            res.end('An error occurred');
            console.log(err);
        }
    })

});

// Side-bar -> SALARY - Salary Distribution for Population - With a disability.
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

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

function httpRESTRequest(headers, apiBodyData, res, pageName) {

    // To store the JSON Response from the BLS Website.
    var jsonResponse = "";

    // HTTP Request object directed to the Endpoint API Headers. Also, handles the JSON Response from the server.
    const httpRequest = https.request(headers, function (response) {

        // console.log("HTTP Response Status: ${res.statusCode}");
        // console.log("HTTP JSON Response: ${JSON.stringify(res.headers)}");

        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            jsonResponse += chunk;
        });

        response.on('end', function () {
            var results = JSON.parse(jsonResponse);
            // console.log(results.Results.series[0].seriesID);
            var results1 = results.Results.series;
            // console.log(results1);

            switch (pageName) {
                case "home":
                    renderHomePage(res, results1);
                    break;
                default:
                    console.log("Invalid page selection.")
            }


        });
    });

    httpRequest.write(JSON.stringify(apiBodyData)); // Writes the JSON Body data on the open connection.
    httpRequest.on('error', function (e) {
        console.error("problem with request: ${e.message}");
    });
    httpRequest.end(); // Closes the HTTP Request connection.
}

// Call this method to render HOME page with graphs.
function renderHomePage(res, graphResult) {
    console.log("-----> " + graphResult[0]);
    ejs.renderFile("./views/welcome.ejs",{ data: graphResult},function (err, result) {
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