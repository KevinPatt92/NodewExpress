var express = require('express');

var fortune = require('./lib/fortune.js');

var app = express();

// set up handlebars view engine
var handlebars = require('express-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars' );

app.set('port', process.env.PORT || 3000);

//static middleware

app.use(express.static(__dirname + '/public'));

//detect querystring middleware

app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

//missing Sections middleware

app.get('/jquery-test', function(req, res){
	res.render('jquery-test');
});

//Weather partial contexts

function getWeatherData(){
    return{
        locations: [
            {
                name: 'Portland',
                forecaseUrl: 'http://wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)'
            },
            {
                name: 'Bend',
                forecaseUrl: 'http://wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)'
            },
            {
                name: 'Manzanita',
                forecaseUrl: 'http://wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)'
            },
        ],
    };
}

//weather middleware

app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weatherContext = getWeatherData();
    next();
});

//Home Page

app.get('/', function(req, res){
    res.render('home');
});

//About Page

app.get('/about', function(req, res){
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    } );
});

//custom 404

app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

//custom 500

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

//tours/hood-river

app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
});

//tours/reqGroupRate

app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});

