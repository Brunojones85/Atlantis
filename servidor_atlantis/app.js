var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    io         = require('socket.io')(server),
    server     = require('http').Server(app),
    Medida     = require("./models/medidas"),
    fs         = require('fs');

//mongo db
mongoose.connect("mongodb://localhost/atlantis",{useMongoClient: true});

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/'));

app.get("/", function(req, res){
	res.render("index");
});

app.get('/favicon.ico', function(req, res) {
    res.status(204);
});


io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

//create new medidas
app.get("/:medida", function(req, res){

    var medida    = parseFloat(req.params.medida);
    var date      =  new Date;
    var newMedida = {medida: medida, date: date};

        console.log(newMedida);
        if(isNaN(medida)) return;

    Medida.create(newMedida, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to index
            io.emit("novo", newMedida);
            console.log("recebi a medida: " + medida);
            res.send('ok');
        }
    });

});

//inicializa o servidor na porta 3000
app.listen(3000, function() {
  console.log('Acesse o servidor http://localhost:3000');
});
