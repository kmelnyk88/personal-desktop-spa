/**
 *
 * @param {HTMLElement} container that represents the player's input area
 * @param {JSON} questionContent represents server response in JSON format
 */
export function createInputArea (container, questionContent) {
  container.innerHTML = ''

  if (Object.prototype.hasOwnProperty.call(questionContent, 'alternatives')) {
    for (const alt in questionContent.alternatives) {
      const lbl = document.createElement('label')
      lbl.innerText = questionContent.alternatives[alt]
      const radioBtn = document.createElement('input')
      radioBtn.type = 'radio'
      radioBtn.name = 'alt'
      radioBtn.value = alt
      lbl.insertAdjacentElement('afterbegin', radioBtn)
      lbl.addEventListener('click', e => e.stopPropagation())
      container.appendChild(lbl)
    }
  } else {
    const textInput = document.createElement('input')
    textInput.addEventListener('click', e => e.stopPropagation())
    textInput.type = 'text'
    container.appendChild(textInput)
  }
}

/**
 *
 * @param {HTMLElement} container represents the area for the player input
 * @returns {string} of the input field
 */
export function getAnswer (container) {
  const answer = container.childNodes

  if (answer.length > 1) {
    for (let i = 0; i < answer.length; i++) {
      if (answer[i].childNodes[0].checked) {
        return answer[i].childNodes[0].value
      }
    }
    return ''
  }
  return answer[0].value
}
