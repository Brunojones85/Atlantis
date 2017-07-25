var express   = require("express"),
app           = express(),
bodyParser    = require("body-parser"),
mongoose      = require("mongoose"),
passport      = require("passport"),
LocalStrategy = require("passport-local"),
http          = require("http").Server(app),
io            = require("socket.io")(http),
Medida        = require("./models/medidas"),
User          = require("./models/user"),
fs            = require("fs");

//MONGODB
mongoose.connect("mongodb://localhost/atlantis",{useMongoClient: true});

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());


//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "atlantis was a great city",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//USER EM TODAS AS ROTAS
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

//SOCKET IO
io.on('connection', function(socket){
  socket.on('medida', function(medida){
    io.emit('medida', medida);
  });
});

//INDEX ROUTE, FAVCON(fix) e SOBRE
app.get("/", function(req, res){
  res.render("index");
});

app.get("/sobre", function(req, res){
  res.render("sobre");
});

app.get('/favicon.ico', function(req, res) {
  res.status(204);
});

//AUTH ROUTES REGISTER
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  console.log(req.body);
  var newUser = new User({username: req.body.username});
  console.log(req.body);
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/grafico");
    });
  });
});

//AUTH ROUTES LOGIN
app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", passport.authenticate("local",
{
    successRedirect: "/grafico",
    failureRedirect: "/login"
  }), function(req, res){
});

//AUTH ROUTES LOGOUT
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

//GRAFICO
app.get("/grafico", function(req, res){
  res.render("grafico");
});

//CREATE NEW MEDIDAS
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

//START SERVER
http.listen(3000, function() {
  console.log('Acesse o servidor http://localhost:3000');
});
