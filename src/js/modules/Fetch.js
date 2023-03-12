/**
 * The following functions are taken from
 * https://gitlab.lnu.se/1dv528/course-content/examples-part-a/-/blob/main/public/example/js/fetch-api/js/modules/Fetch.js
 */

/**
 *
 * @param {string} url to send request to
 * @returns {object}  the JSON response
 */
export async function get (url) {
  // Do a fetch request on that url using await
  const response = await fetch(url)

  // Get the response as json (asynchronous request)
  const data = await response.json()

  // Check if status is ok
  if (!response.ok) {
    console.log(response)
    throw new Error(response.status)
  }

  return data
}

/**
 *
 * @param {string} url to post to
 * @param {object} body the actual answer that is going to be sent to the server
 * @returns {object}  the JSON response
 */
export async function post (url, body = null) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  const response = await fetch(url, options)
  const data = await response.json()

  // Check if status is ok
  if (!response.ok) {
    throw new Error(response.status)
  }
  return data
}
