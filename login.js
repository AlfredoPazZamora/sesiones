//Declaración de paquetes
let mysql = require("mysql");
let express = require("express");
let session = require("express-session");
let bodyParser = require('body-parser');
let path = require('path');

//Conexión a la base de datos
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodelogin",
});

let app = express();

//Iniciar con las sesiones
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/login.html"));
});

app.post('/auth', (req, res) => {
    let username = req.body.username;
    let pw       = req.body.pw

    if(username && pw){
        connection.query('SELECT * FROM accounts WHERE username = ? AND pw = ?', [username, pw], 
        (error, results, fields) => {
            if(results.length > 0){
                req.session.loggedin = true
                req.session.username = username;
                req.session.facultad = 'Telematica';

                res.redirect('/home');
            }else{
                res.send('Usuario y contraseña incorrectos');
            }
            res.end();
        });
    }else{
        res.send('Favor de ingresar usuario y contraseña');
        res.end();
    }
});

app.get('/home', (req, res) => {
    if(req.session.loggedin){
        res.send('Bienvenido de nuevo, ' 
        + req.session.username + ' alumno de ' + req.session.facultad +
        '<br><br> <a href="/logout">Cerar sesion</a>');
    }else{
        res.send('Iniciar sesion de nuevo, gracias');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
})


app.listen(3000, function () {
  console.log("Puesto en marcha el server en puerto 3000");
});
