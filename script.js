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

function Canvas(selector, log=()=>{}){
  const root = document.querySelector(selector)
  const svg = root.children[0]
  const widgets = root.children[1]
  log("Canvas widgets node: ", widgets)
  log("Canvas SVG node: ",svg)

  let tX = 0
  let tY = 0 //svg viewBox x y
  let scale = 1
  let isDragging = false
  let pX = 0 //pointer x
  let pY = 0 //pointer y

  const grid = addGridToSVG(svg)

  let lastGridScale = 0

  this.set_position = (x,y,s) => {
    // TODO: do nothing if x,y,s already equals to tX,tY,scale
    const width = svg.clientWidth
    const height = svg.clientHeight

    svg.setAttribute("viewBox", `${x-(width/2*s)} ${y-(height/2*s)} ${width*s} ${height*s}`)

    tX = x
    tY = y
    scale = s

    const gridScale = Math.max(1,Math.floor(scale))
    if ((powersOf3.includes(gridScale)) && (lastGridScale != gridScale)){
      lastGridScale = gridScale
      grid.style.transform = `scale(${gridScale})`
    }

    widgets.style.transform = `translate(${(width/2)-x/s}px,${(height/2)-y/s}px) scale(${1/s})`
  }

  svg.addEventListener('pointerdown',(event) => {
    event.preventDefault()
    isDragging = true
    pX = event.clientX
    pY = event.clientY
  })

  const onPointerMove = (event) => {
    event.preventDefault()

    if (!isDragging) {
      return
    }

    if (!event.buttons) {
      isDragging = false
      return
    }

    const {clientX,clientY} = event

    const nX = tX - (clientX - pX)*scale
    const nY = tY - (clientY - pY)*scale

    this.set_position(nX,nY,scale)

    pX = clientX
    pY = clientY
  }

  svg.addEventListener('pointermove', onPointerMove)
  widgets.addEventListener('pointermove', onPointerMove)

  const onWheel = (event) => {
    event.preventDefault()
    const oldScale = scale

    scale += event.deltaY * 0.001
    scale = Math.min(Math.max(0.05,scale))

    this.set_position(tX,tY,scale)
  }

  svg.addEventListener('wheel', onWheel)
  widgets.addEventListener('wheel', onWheel)

}

const canvas = new Canvas("#canvas")
canvas.set_position(0,0,1)

