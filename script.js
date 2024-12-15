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
  width: altSvg.clientWidth,
  height: altSvg.clientHeight,
  scale: 1,
}

console.log(altSvg)
altSvg.addEventListener('pointerdown',(event) => {
  event.preventDefault()
  console.log('s')
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


  const dX = clientX - altState.x
  const dY = clientY - altState.y
  altState.tX = altState.tX - dX * altState.scale
  altState.tY = altState.tY - dY * altState.scale

  altSvg.setAttribute("viewBox", `${altState.tX} ${altState.tY} ${altState.width*altState.scale} ${altState.height*altState.scale}`)

  altState.x = clientX
  altState.y = clientY
})

altSvg.addEventListener('wheel', (event) => {
  event.preventDefault()
  const oldScale = altState.scale

  altState.scale += event.deltaY * 0.001
  altState.scale = Math.min(Math.max(0.05,altState.scale))

  altState.tX -= (altState.width * altState.scale - altState.width * oldScale ) / 2
  altState.tY -= (altState.height * altState.scale - altState.height * oldScale ) / 2

  altSvg.setAttribute("viewBox", `${altState.tX} ${altState.tY} ${altState.width*altState.scale} ${altState.height*altState.scale}`)
})

