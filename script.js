const powersOf3 = [1,3,9,27,81]

function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

// TODO: Write better random generation function with variable length
function randStr (prefix="") {
  if (""+prefix != "") { prefix = prefix+"_" }
  return prefix+Math.random().toString(16).slice(2);
}

function randID(prefix="", doc=document) {
  while (true) {
    let rid = randStr(prefix)
    if (doc.getElementById(rid)) {continue}
    return rid
  }
}

function addGridToSVG(svg) {
  const defs = svg.children[0]
  const pat1 = randID(svg.id+"_pat1")
  const pat2 = randID(svg.id+"_pat1")
  const pat3 = randID(svg.id+"_pat1")
  defs.insertAdjacentHTML("afterbegin", `
    <pattern id="${pat1}" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M 10 0 L 0 0 0 10" fill="none" stroke-width="0.5"/>
    </pattern>
    <pattern id="${pat2}" width="30" height="30" patternUnits="userSpaceOnUse">
      <rect width="30" height="30" fill="url(#${pat1})"/>
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke-width="1"/>
    </pattern>
    <pattern id="${pat3}" width="90" height="90" patternUnits="userSpaceOnUse">
      <rect width="90" height="90" fill="url(#${pat2})"/>
      <path d="M 90 0 L 0 0 0 90" fill="none" stroke-width="2"/>
    </pattern>
  `)
  const grid = document.createElementNS('http://www.w3.org/2000/svg',"rect")
  svg.appendChild(grid)
  setAttributes(grid, {
    x: "-180000",
    y: "-180000",
    width: "720000",
    height: "720000",
    fill: `url(#${pat3})`,
    style: "transform: scale(1);",
  })
  return grid
}

class WhiteBoard extends HTMLElement {
  #svg
  #widgets
  #tX
  #tY
  #scale
  #isDragging
  #pX
  #pY
  #grid
  #lastGridScale

  constructor () {
    super()
  }

  connectedCallback() {
    if (document.readyState === 'complete') {
      this.#init()
    }else{
      document.addEventListener("DOMContentLoaded", (e) => { this.#init() });
    }
  }

  #init() {
    // console.log(this)
    this.#svg = this.children[0]
    this.#widgets = this.children[1]
    // log("Canvas widgets node: ", widgets)
    // console.log("Canvas SVG node: ",this.children)

    this.#tX = 0
    this.#tY = 0 //svg viewBox x y
    this.#scale = 1
    this.#isDragging = false
    this.#pX = 0 //pointer x
    this.#pY = 0 //pointer y

    this.#grid = addGridToSVG(this.#svg)

    this.#lastGridScale = 0

    this.#svg.addEventListener('pointerdown',(event) => {
      event.preventDefault()
      this.#isDragging = true
      this.#pX = event.clientX
      this.#pY = event.clientY
    })

    this.#svg.addEventListener('pointermove', (e) => {this.#onPointerMove(e)})
    this.#widgets.addEventListener('pointermove', (e) => {this.#onPointerMove(e)})

    this.#svg.addEventListener('wheel', (e) => {this.#onWheel(e)})
    this.#widgets.addEventListener('wheel', (e) => {this.#onWheel(e)})
  }

  set_position(x,y,s){
    // TODO: do nothing if x,y,s already equals to tX,tY,scale
    const width = this.#svg.clientWidth
    const height = this.#svg.clientHeight

    this.#svg.setAttribute("viewBox", `${x-(width/2*s)} ${y-(height/2*s)} ${width*s} ${height*s}`)

    this.#tX = x
    this.#tY = y
    this.#scale = s

    const gridScale = Math.max(1,Math.floor(this.#scale))
    if ((powersOf3.includes(gridScale)) && (this.#lastGridScale != gridScale)){
      this.#lastGridScale = gridScale
      this.#grid.style.transform = `scale(${gridScale})`
    }

    this.#widgets.style.transform = `translate(${(width/2)-x/s}px,${(height/2)-y/s}px) scale(${1/s})`
  }

  // BUG: Widgests plane dont adapt when component size change

  #onPointerMove(event){
    event.preventDefault()

    if (!this.#isDragging) {
      return
    }

    if (!event.buttons) {
      this.#isDragging = false
      return
    }

    const {clientX,clientY} = event

    const nX = this.#tX - (clientX - this.#pX)*this.#scale
    const nY = this.#tY - (clientY - this.#pY)*this.#scale

    this.set_position(nX,nY,this.#scale)

    this.#pX = clientX
    this.#pY = clientY
  }

  #onWheel(event){
    event.preventDefault()
    const oldScale = this.#scale

    this.#scale += event.deltaY * 0.001
    this.#scale = Math.min(Math.max(0.05,this.#scale))

    this.set_position(this.#tX,this.#tY,this.#scale)
  }
}


customElements.define("w-board", WhiteBoard);
// const canvas = new Canvas("#canvas")
// canvas.set_position(0,0,1)

