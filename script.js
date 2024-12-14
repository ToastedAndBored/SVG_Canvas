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

