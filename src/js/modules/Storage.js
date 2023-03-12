
let cachedMessages
// I chose to store only 50 last messages
const chatCacheSize = 50

/**
 * Loads chat messages from the local storage
 */
export function loadCachedMessages () {
  if ('chatCache' in localStorage) {
    cachedMessages = JSON.parse(localStorage.getItem('chatCache'))
  } else {
    cachedMessages = []
  }
}

/**
 *
 * @returns {Array} collection of the chat messages that were stored in the local storage
 */
export function getCachedMessages () {
  return cachedMessages
}

/**
 *
 * @param {object} chatMessage  the object that contains different properties of the chat message
 */
export function saveChatMessage (chatMessage) {
  cachedMessages.push(chatMessage)
  // removing duplicates with Set
  cachedMessages = [...new Set(cachedMessages)]
  if (chatMessage.size > chatCacheSize) {
    // keeping cache of 50 messages
    cachedMessages = cachedMessages.splice(chatMessage.size - chatCacheSize)
  }
  localStorage.setItem('chatCache', JSON.stringify(cachedMessages))
}

/**
 *
 * @param {string} nickname of the player
 * @param {string} time seconds of answering a question
 */
export function saveTime (nickname, time) {
  const playerTiming = {
    name: nickname,
    time
  }

  let playersTimings = getTimings()

  if (playersTimings == null) {
    playersTimings = []
  }
  playersTimings.push(playerTiming)
  const sorted = playersTimings.sort((t1, t2) =>
    t1.time > t2.time ? 1 : t1.time < t2.time ? -1 : 0
  )
  localStorage.setItem('timings', JSON.stringify(sorted.slice(0, 5)))
}

/**
 * @returns {Array} of players names and their timings
 */
export function getTimings () {
  if ('timings' in localStorage) {
    return JSON.parse(localStorage.getItem('timings'))
  }
  return []
}

/**
 * @param {object} timing object that represents player timings of finishing one quiz game
 * @returns {string} string representation of player name and seconds it took him/her to finish one quiz
 */
export function timingToString (timing) {
  return `${timing.name}: ${timing.time} sec.`
}
