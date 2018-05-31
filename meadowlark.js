var express = require('express');

var fortune = require('./lib/fortune.js');

var app = express();

//set up handlebars view engine

var handlebars = require('express-handlebars')
    .create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars' );

app.set('port', process.env.PORT || 3000);

//static middleware

app.use(express.static(__dirname + '/public'));

//detect querystring middleware

app.use/(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

//Home Page

app.get('/', function(req, res){
    res.render('home');
});

//About Page

app.get('/about', function(req, res){
    res.render('about', {fortune: fortune.getFortune() } );
});

//custom 404

app.use(function(req, res, next){
    res.status(404);
    res.render('404');
})

//custome 500

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
})

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});