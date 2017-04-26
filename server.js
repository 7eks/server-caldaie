const express = require('express')
const app = express()
const http = require('http')
const sql = require("./sqlite")
const webSocket = require('ws')
const PORT = 3000
const server = http.createServer(app)
const wss = new webSocket.Server({ server })

//funzione per il broadcast dei dati ricevuti
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  })
}


var dato = {
  'prs': {
    'prs_caldaia2': 'bolean',
    'prs_caldaia1': 'bolean'
  },
  'spoglc': {
    'spoglc_boyler1': 'numeric'
  }
};

//impostazione dell'engine per il rendering del
//template dalla pagina html
app.set('view engine', 'pug')

//Setta la cartella pubblica
app.use(express.static('public'))

//Root normalmente ricevuta dal client
//risponde con una pagina html creata
//in modo dinamico
app.get('/', (req, res) => res.render('index', {result: dato}));

//Root ricezione dati da singole raspberry
//riceve un oggetto contenente in nome della
//variabile con il suo valore ed il nome
//del nodo di origine (Relativo Db)
app.get('/dati/', (req, res) => {
  sqlite.tx(req.query)
  wss.broadcast(req.query)
});

//Root per la ricezione e la risposta
//di query sql (eseguite dal client con ajax)
app.get('/sql/', (req, res) => res.send(sqlite.query(req.query)));

//Avvia il server http sulla porta selezionata
app.listen(PORT, () => console.log('server running on port ' + PORT.toString()));


process.on('exit', () => query.closedb());
