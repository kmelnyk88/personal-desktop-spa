export default class Player {
  #nickname
  #time = 0

  setNickName (nickname) {
    if (!nickname) {
      this.#nickname = 'Incognito'
    } else {
      this.#nickname = nickname
    }
  }

  getNickName () {
    return this.#nickname
  }

  updateTime (seconds) {
    this.#time += seconds
  }

  /**
   *
   * @returns {number} get the total number of seconds that it took player to finish the game
   */
  getTime () {
    return this.#time
  }
}
