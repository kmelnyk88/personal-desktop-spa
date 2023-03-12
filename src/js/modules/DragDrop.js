export { initializeDragElement, initializeDropArea }

const margin = 20
let source
let border

/**
 *
 * @param {HTMLElement} dragEl DOM element to be dragged
 */
function initializeDragElement (dragEl) {
  const temp = dragEl
  dragEl.addEventListener('dragstart', (e) => {
    source = temp
    source.style.opacity = 0.3
    border = source.style.border
    source.style.border = 'thin solid #F5F5F5'
    e.dataTransfer.setData('text/plain', `${e.clientX},${e.clientY}`)
  })

  dragEl.addEventListener('dragover', (e) => {
    e.preventDefault()
  })

  dragEl.addEventListener('dragend', () => {
    // move source as the last child of the parent therefore giving source the highest priority among siblings
    source.parentElement.appendChild(source)
    source.style.opacity = 1
    source.style.border = border
  })
}

/**
 *
 * @param {HTMLElement} dropArea DOM element to be a droppable area
 */
function initializeDropArea (dropArea) {
  dropArea.addEventListener('dragenter', (e) => {
    e.preventDefault()
  })

  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault()
  })

  dropArea.addEventListener('drop', (e) => {
    e.preventDefault()

    const transferData = e.dataTransfer.getData('text/plain').split(',')

    let newX = source.offsetLeft + (e.clientX - parseInt(transferData[0]))
    let newY = source.offsetTop + (e.clientY - parseInt(transferData[1]))

    // check the crossing of x axis margins
    if (newX < margin) {
      newX = margin
    } else if (newX > dropArea.clientWidth - margin - source.clientWidth) {
      newX = dropArea.clientWidth - margin - source.clientWidth
    }

    // check the crossing of y axis margins
    if (newY < margin) {
      newY = margin
    } else if (newY > dropArea.clientHeight - margin - source.clientHeight) {
      newY = dropArea.clientHeight - margin - source.clientHeight
    }

    source.style.left = newX + 'px'
    source.style.top = newY + 'px'
  })
}
