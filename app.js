var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var notes = require('./public/data/keepData.json');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
    next();
});

app.use(express.static("./public"));

app.use(cors());

app.get("/keep/:user", function(req, res) {
    var userId = req.params.user;
    var index = parseInt(userId.charAt(userId.length-1)) - 1;
    if (notes.length < (index + 1)) {
        var obj = {};
        obj[userId] = [];
        notes.push(obj);
        res.json({title: "Welcome", content: "New User"})
    } else {
        res.json(notes[index][userId]);
    }
});

app.post("/keep/:user", function(req, res) {
    var userId = req.params.user;
    var index = parseInt(userId.charAt(userId.length-1)) - 1;
    notes[index][userId].push(req.body);
    console.log("index is:" + index);
    console.log(notes[index][userId]);
    res.json(notes[index][userId]);
});

app.delete("/keep/:user/:term", function(req, res) {
    var userId = req.params.user;
    var index = parseInt(userId.charAt(userId.length-1)) - 1;
    var terms = notes[index][userId];
    terms = terms.filter(function(definition, i, list) {
        return i !== parseInt(req.params.term);
    });
    notes[index][userId] = terms
    res.json(notes[index][userId]);
});

app.listen(3000);

console.log("Express app running on port 3000");

module.exports = app;