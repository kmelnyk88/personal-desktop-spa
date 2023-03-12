export default class Timer {
  #limit = 10
  #timerId

  #timeOut = new Event('timeout')

  /**
   *
   * @param {HTMLElement} element to display the value of the timer
   */
  startTimer (element) {
    let interval = this.#limit
    element.textContent = interval

    this.#timerId = setInterval(() => {
      interval--
      element.textContent = interval
      if (interval < 0) {
        element.dispatchEvent(this.#timeOut)
        this.stopTimer()
      }
    }, 1000)
  }

  stopTimer () {
    clearInterval(this.#timerId)
  }

  /**
   *
   * @param {HTMLElement} element to get the value of the left seconds
   * @returns {number} seconds it took to answer one question
   */
  getTiming (element) {
    return this.#limit - Number(element.textContent)
  }
}
