// const a = document.querySelectorAll('*[id]')
const ar = Array.from(document.querySelectorAll('*[id]'))

const cerchio=[' led rosso','  led verde']

const dati = [{
  name: 'prs_caldaia2',
  value: 1
}, {
  name: 'prs_caldaia1',
  value: 0
}, {
  name: 'spoglc_boyler1',
  value: 70
}, {
  name: 'prova',
  value: 35
}]
function check_presence(artc) {return function(element){return artc === element.id}}
for (let x in dati) {
  let b = ar.filter(check_presence(dati[x].name))
  if (b.length > 0){
    var c = ar.filter(check_presence(b[0].id + '_widget'))
    ;(c[0].attributes[2].value == 'bolean')?c[0].innerHTML = cerchio[dati[x].value]:c[0].innerHTML = '  ' + dati[x].value
  }
}

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
});
