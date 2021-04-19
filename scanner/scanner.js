const InputEvent = require('input-event')
const config = require(__dirname + '/../config/config.json')
const keys = 'X^1234567890XXXXqwertzuiopXXXXasdfghjklXXXXXyxcvbnmXXXXXXXXXXXXXXXXXXXXXXX'
const input = new InputEvent(`/dev/input/event0`)
const keyboard = new InputEvent.Keyboard(input)

let string = ''

keyboard.on('keyup', function(event) {
  // Enter key
  if (event.code == 28) {
    console.log(`Read Card ID: ${string}`)

    //process code

    const protocol = config.ssl ? 'https://' : 'http://'
    var baseURL = `${protocol}${config.host}:${config.port}
    /play/${string}`

    if (config.room) {
      baseURL += `/${config.room}`
    }

    const init = {
      method: 'POST',
    }

    // Compare to false so that we don't disable SSL if option omitted
    if (config.verify_ssl === false) {
      init.agent = new https.Agent({
        rejectUnauthorized: false,
      })
    }

    return fetch(baseURL, init)
      .then(res => res.text())
      .catch(error => console.log(error))

    // reset string for next scan
    string = ''
  } else {
    string += keys[event.code]
  }
})
