var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    Battle = require('./model/battle');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/battle", function(req, res) {
    /*
     * Init battle
     */
    battle = new Battle();

    /*
     * Configurate battle
     */
    var excludes = req.body.exclude;
    var maxValues = req.body.max;
    var minValues = req.body.min;
    battle.battleConfig.config(excludes, maxValues, minValues);
    
    res.send(battle.battleConfig.default_strategies);
});


var server = app.listen(app.get('port'), function() {
    console.log("Server is listening on port " + server.address().port);
});
