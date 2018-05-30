var express = require('express');

var app = express();

//set up handlebars view engine

var handlebars = require('express-handlebars')
    .create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars' );

app.set('port', process.env.PORT || 3000);

//Fortune cookies

var fortunes = [
    "Conquer your fears",
    "Be the river",
    "Have no fear",
    "Hail Satan",
    "Its the economy stupid"
];

//static middleware

app.use(express.static(__dirname + '/public'));

//Home Page

app.get('/', function(req, res){
    res.render('home');
});

//About Page

app.get('/about', function(req, res){
    var randomFortune =
        fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', {fortune: randomFortune });
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