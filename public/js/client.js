// const a = document.querySelectorAll('*[id]')
const ar = Array.from(document.querySelectorAll('*[id]'))
console.log(ar)

const cerchio=['<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><filter height="200" width="200" y="-50" x="-50" id="svg_1_blur"><feGaussianBlur stdDeviation="10" in="SourceGraphic"/></filter></defs><title>  background</title><rect id="canvas_background" height="100" width="100" y="-1" x="-1" fill="#fff"/><g height="100" width="100" id="canvasGrid"><rect height="100" width="100" fill="url(#gridpattern)"/></g><title>  Layer 1</title><ellipse filter="url(#svg_1_blur)" ry="5" rx="5" id="svg_1" cy="50" cx="50" style="fill:#CE7975;stroke-width:2;stroke:#000"/></svg>',
'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><filter height="200" width="200" y="-50" x="-50" id="svg_1_blur"><feGaussianBlur stdDeviation="10" in="SourceGraphic"/></filter></defs><title>  background</title><rect id="canvas_background" height="100" width="100" y="-1" x="-1" fill="#fff"/><g height="100" width="100" id="canvasGrid"><rect height="100" width="100" fill="url(#gridpattern)"/></g><title>  Layer 1</title><ellipse filter="url(#svg_1_blur)" ry="5" rx="5" id="svg_1" cy="50" cx="50" style="fill:#A0D58A;stroke-width:2;stroke:#000"/></svg>']

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
    console.log(c);
    (c[0].attributes[2].value == 'bolean')?c[0].innerHTML = cerchio[dati[x].value]:c[0].innerHTML = dati[x].value
  }
}
