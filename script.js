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

const altSvg = document.querySelector('#alt_svg')

let altState = {
  tX: 0,
  tY: 0,
  scale: 1,
}

console.log(altSvg)
altSvg.addEventListener('pointerdown',(event) => {
  event.preventDefault()
  altState.isDragging = true
  altState.x = event.clientX
  altState.y = event.clientY
})

altSvg.addEventListener('pointermove', (event) => {
  event.preventDefault()
  if (!altState.isDragging) {
    return
  }

  if (!event.buttons) {
    altState.isDragging = false
    return
  }

  const {clientX,clientY} = event


  const width = altSvg.clientWidth
  const height = altSvg.clientHeight

  const dX = clientX - altState.x
  const dY = clientY - altState.y
  altState.tX = altState.tX - dX * altState.scale
  altState.tY = altState.tY - dY * altState.scale

  altSvg.setAttribute("viewBox", `${altState.tX} ${altState.tY} ${width*altState.scale} ${height*altState.scale}`)

  altState.x = clientX
  altState.y = clientY
})

const grid = document.querySelector("#grid")

altSvg.addEventListener('wheel', (event) => {
  event.preventDefault()
  const oldScale = altState.scale

  altState.scale += event.deltaY * 0.001
  altState.scale = Math.min(Math.max(0.05,altState.scale))

  const width = altSvg.clientWidth
  const height = altSvg.clientHeight

  altState.tX -= (width * altState.scale - width * oldScale ) / 2
  altState.tY -= (height * altState.scale - height * oldScale ) / 2
  altSvg.setAttribute("viewBox", `${altState.tX} ${altState.tY} ${width*altState.scale} ${height*altState.scale}`)
  console.log(altState.scale)
  grid.style.transform = `scale(${Math.max(1, Math.floor(altState.scale/3)*3)})`
  // if(oldScale < 9 && altState.scale >= 9) {
  //   grid.style.transform = `scale(9)`
  // }else if(oldScale >= 9 && altState.scale < 9) {
  //   grid.style.transform = `scale(3)`
  // }else if (oldScale < 3 && altState.scale >= 3) {
  //  grid.style.transform = `scale(3)`

  // }else if(oldscale >= 3 && altstate.scale < 3) {
  //   grid.style.transform = `scale(1)`
  // }
})



