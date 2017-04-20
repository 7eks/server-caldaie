var sqlite3 = require("sqlite3");

var sqlite = () => {
  var scope = this;
  scope.dblist = new sqlite3.Database("./db/dblist.db");
  //oggetto contenente la lista dei db aperti come chiave e l' eventuale
  //apertura della finestra raccolta query sul relativo db
  scope.activedb = {
    'dblist': false
  };
  console.log(scope.dblist);

  //Inizializza i vari db contenuti nella tabella list di dblist.db
  this.initdb = () => {
    scope.dblist.each("SELECT * FROM list", function(err, row) {
      scope[row.name] = new sqlite3.Database("./db/" + row.name + ".db");
      scope.activedb[row.name] = false;
      console.log(scope[row.name]);
      if (err) console.log(err);
    });
  }

  //Trasmette i dati ricevuti verso il database corrispondente alla propietà
  //"node" sulla tabella "name" il valore contenuto in "value" e un timestamp
  this.tx = (get) => {
    if (scope[get.node]) {
      //apre una finestra di TRANSACTION al fine di ottimizzare la scrittura ed eseguire le query in ordine
      if (!scope.activedb[get.node]) {
        scope[get.node].run('BEGIN');
        scope.activedb[get.node] = true;
        setTimeout(() => {
          scope[get.node].run('COMMIT');
          scope.activedb[get.node] = false;
        }, 5000);
      }
      scope[get.node].run("INSERT INTO " + get.name + " VALUES (?, ?)", [Date.now(), get.value], (err) => {
        if (err) console.log(err);
      });
    }
  };

  //Chiude tutti i  database inizializzati
  this.closedb = () => {
    var x;
    for (x in scope.activedb) {
      scope[x].close((err)=>{console.log(err);});
      console.log(x + '.db chiuso correttamente');
    }
  }
}
module.exports = sqlite;
