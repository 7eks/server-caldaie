var express = require('express')
var app = express()
var http = require('http')
var sql = require("./sqlite")
var webSocket = require('ws')
var bodyParser = require('body-parser')
const util = require('util')
var PORT = 3000
var wss = new webSocket.Server({ port : PORT + 1 })
var sqlite = new sql()

//funzione per il broadcast dei dati ricevuti
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === webSocket.OPEN) {
      client.send(data);
    }
  })
}

var dato = sqlite.initdb()


//impostazione dell'engine per il rendering del
//template dalla pagina html
app.set('view engine', 'pug')

//Setta la cartella pubblica
app.use(express.static('public'))
app.use(bodyParser.text())
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

//Root normalmente ricevuta dal client
//risponde con una pagina html creata
//in modo dinamico
app.get('/', (req, res) => res.render('index', {result: dato}));

//Root ricezione dati da singole raspberry
//riceve un oggetto contenente in nome della
//variabile con il suo valore ed il nome
//del nodo di origine (Relativo Db)
app.get('/dati/', (req, res) => {
  console.log(req.query)
  wss.broadcast(JSON.stringify(req.query))
  sqlite.tx(req.query)
  res.end()
});

//Root per la ricezione e la risposta
//di query sql (eseguite dal client con ajax)
app.get('/sql/', (req, res) => res.send(sqlite.query(req.query)));

//Root per la richiesta di aggiornamentodella pagina
app.post('/update', function (req, res) {
  console.log(util.inspect(JSON.parse(req.body), false, null))
  res.end()
})

//Avvia il server http sulla porta selezionata
app.listen(PORT, () => console.log('server running on port ' + PORT.toString()));


process.on('exit', () => query.closedb());
