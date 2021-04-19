const InputEvent = require('input-event')
const config = require(__dirname + '/../config/config.json')
const fetch = require('node-fetch')
const keys = 'X^1234567890XXXXqwertzuiopXXXXasdfghjklXXXXXyxcvbnmXXXXXXXXXXXXXXXXXXXXXXX'
const input = new InputEvent(`/dev/input/event0`)
const keyboard = new InputEvent.Keyboard(input)

let string = ''

keyboard.on('keyup', function(event) {
  // Enter key
  if (event.code == 28) {
    console.log(`Read Card ID: ${string}`)

    let cardCode = string
    // reset string for next scan
    string = ''


    //process code
    const protocol = 'http://'
    var baseURL = `${protocol}${config.host || "localhost"}:${config.port || "5000"}/play/${cardCode}`

    if (config.room) {
      baseURL += `/${config.room}`
    }

    const init = {
      method: 'POST',
    }

    return fetch(baseURL, init)
      .then(res => consol.log(res.text()))
      .catch(error => console.log(error))

  } else {
    string += keys[event.code]
  }
})
