var sqlite3 = require("sqlite3");
module.exports = function() {
  scope = this
  scope.dblist = new sqlite3.Database("./db/dblist.db")
  scope.activedb = {
    'dblist': false
  }

  //Inizializza i vari db contenuti nella tabella list di dblist.db
  //e manda come risultato un ogg contenente la 'mappa' di tutti i nodi
  this.initdb = function() {
    var lista = {}
    scope.dblist.each("SELECT * FROM list", function(err, row) {
      scope[row.name] = new sqlite3.Database("./db/" + row.name + ".db")
      scope.activedb[row.name] = false
      scope.dblist.each('SELECT * FROM ' + row.name, function(err, row2) {
        if (lista[row.name] === undefined) lista[row.name] = {}
        lista[row.name][row2.name] = row2.type
      })
      if (err) console.log(err)
    })
    return lista
  }

  //Trasmette i dati ricevuti verso il database corrispondente alla propietà
  //"node" sulla tabella "name" il valore contenuto in "value" e un timestamp
  this.tx = function(get) {
    if (scope[get.node]) {
      //apre una finestra di TRANSACTION al fine di ottimizzare la
      //scrittura ed eseguire le query in ordine
      if (!scope.activedb[get.node]) {
        scope[get.node].run('BEGIN')
        scope.activedb[get.node] = true
        setTimeout(() => {
          scope[get.node].run('COMMIT')
          scope.activedb[get.node] = false
        }, 1000);
      }
      scope[get.node].run("INSERT INTO " + get.name + " VALUES (?, ?)", [Date.now(), get.value], (err) => {
        if (err) console.log(err)
      })
    }
  };

  //Restituisce l'ultimo valore della tabella richiesta del relativo db
  this.request = function(req) {
    if (scope[req.nodo] == true) {
      window.setTimeout(this.request(req), 100); /* this checks the flag every 100 milliseconds*/
    } else {
      let tosend
      scope[req.nodo].get('SELECT * FROM ' + req.table + ' ORDER BY time DESC LIMIT 1', (err, row) => {
        toSend = {
          name: req.table,
          value: row.value
        }
      })
    }
  }

  //Chiude tutti i  database inizializzati
  this.closedb = function() {
    var x
    for (x in scope.activedb) {
      scope[x].close((err) => {
        console.log(err);
      });
      console.log(x + '.db chiuso correttamente');
    }
  }
}
