const a = document.querySelectorAll('*[id]')
const ar = Array.from(document.querySelectorAll('*[id]'))
const cerchio=[' led rosso','  led verde']
var xhttp=new XMLHttpRequest()
function check_presence(artc) {return function(element){return artc === element.id}}


// Crea connessione WebSocket
const ws = new WebSocket('ws://' + window.location.hostname + ':' +(Number(window.location.port)+1));

// messaggio dal socket
ws.addEventListener('message', function (event) {
  let dato = JSON.parse(event.data)
  let b = ar.filter(check_presence(dato.name))
  if (b.length > 0){
    var c = ar.filter(check_presence(b[0].id + '_widget'))
    ;(c[0].attributes[2].value == 'bolean')?c[0].innerHTML = cerchio[dato.value]:c[0].innerHTML = '  ' + dato.value
  }
})

//richiede un aggiornamento per i valori presenti nella paginavar valar =[]
function valuesid(element){return (element.className === 'value')}
function extract(obj){return{nodo:obj.parentElement.parentElement.id, table:obj.id}}

xhttp.open("POST",window.location.href+'update', true)
xhttp.onreadystatechange = function () {}
xhttp.setRequestHeader("UP", "update");

xhttp.send(JSON.stringify(ar.filter(valuesid).map(extract)))
