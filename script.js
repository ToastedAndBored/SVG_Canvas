const dragableBox = document.querySelector('.dragable_box')

let state = {
  tX: 0,
  tY: 0,
  scale: 1,

}
dragableBox.addEventListener('pointerdown',(event) => {
  event.preventDefault()
  state.isDragging = true
  state.x = event.clientX
  state.y = event.clientY
})

dragableBox.addEventListener('pointermove', (event) => {
  event.preventDefault()
  if (!state.isDragging) {
    return
  }

  if (!event.buttons) {
    state.isDragging = false
    return
  }

  const {clientX,clientY} = event

  const dX = clientX - state.x
  const dY = clientY - state.y
  state.tX = state.tX + dX
  state.tY = state.tY + dY

  dragableBox.style.transform = `translate(${state.tX}px,${state.tY}px) scale(${state.scale})`

  state.x = clientX
  state.y = clientY
})

dragableBox.addEventListener('wheel', (event) => {
  event.preventDefault()

  state.scale += event.deltaY * 0.001
  state.scale = Math.min(Math.max(0.1,state.scale))

  dragableBox.style.transform = `translate(${state.tX}px,${state.tY}px) scale(${state.scale})`
})


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
    rid = randStr(prefix)
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
      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="lightblue" stroke-width="0.5"/>
    </pattern>
    <pattern id="${pat2}" width="30" height="30" patternUnits="userSpaceOnUse">
      <rect width="30" height="30" fill="url(#${pat1})"/>
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="yellow" stroke-width="1"/>
    </pattern>
    <pattern id="${pat3}" width="90" height="90" patternUnits="userSpaceOnUse">
      <rect width="90" height="90" fill="url(#${pat2})"/>
      <path d="M 90 0 L 0 0 0 90" fill="none" stroke="red" stroke-width="2"/>
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
  const svg = document.querySelector(selector)

  log(svg)

  let tX = 0
  let tY = 0 //svg viewBox x y
  let scale = 1
  let isDragging = false
  let pX = 0 //pointer x
  let pY = 0 //pointer y

  svg.addEventListener('pointerdown',(event) => {
    event.preventDefault()
    isDragging = true
    pX = event.clientX
    pY = event.clientY
  })

  svg.addEventListener('pointermove', (event) => {
    event.preventDefault()
    if (!isDragging) {
      return
    }

    if (!event.buttons) {
      isDragging = false
      return
    }

    const {clientX,clientY} = event

    const width = svg.clientWidth
    const height = svg.clientHeight

    const dX = clientX - pX
    const dY = clientY - pY
    tX = tX - dX * scale
    tY = tY - dY * scale

    svg.setAttribute("viewBox", `${tX} ${tY} ${width*scale} ${height*scale}`)

    pX = clientX
    pY = clientY
  })

  const grid = addGridToSVG(svg)

  let lastGridScale = 0

  const powersOf3 = [1,3,9,27,81]

  svg.addEventListener('wheel', (event) => {
    event.preventDefault()
    const oldScale = scale

    scale += event.deltaY * 0.001
    scale = Math.min(Math.max(0.05,scale))

    const width = svg.clientWidth
    const height = svg.clientHeight

    tX -= (width * scale - width * oldScale ) / 2
    tY -= (height * scale - height * oldScale ) / 2
    svg.setAttribute("viewBox", `${tX} ${tY} ${width*scale} ${height*scale}`)
    const gridScale = Math.max(1,Math.floor(scale))
    if ((powersOf3.includes(gridScale)) && (lastGridScale != gridScale)){
      lastGridScale = gridScale
      grid.style.transform = `scale(${gridScale})`
    }
    })

}

const canvas = new Canvas("#alt_svg", console.log)

