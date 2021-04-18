const fs = require('fs')

const SonosAction = require('./actions/SonosAction')
const HomeAssistantAction = require('./actions/HomeAssistantAction')
const ChannelsAction = require('./actions/ChannelsAction')
const ScriptAction = require('./actions/ScriptAction')

class CardProcessor {
  process(code, room) {
    console.log('Finding card...')
    let card = this.findCard(code)

    if (!card) {
      console.log('Card not found.')
      return
    }

    console.log(`Found card: ${card.title}. Processing...`)
    this.processCard(card, room)
  }

  findCard(code) {
    const data = fs.readFileSync(__dirname + '/../../config/cards.json').toString()
    const cards = JSON.parse(data)

    const card = cards.find(c => c.code === code)
    return card
  }

  processCard(card, room) {
    const actionData = fs.readFileSync(__dirname + '/../../config/actions.json').toString()
    const actions = JSON.parse(actionData)
    let action = actions[card.action]

    if (!action) {
      console.log(`Action not found: ${card.action}`)
      return
    }

    console.log(`Processing action: ${card.action}`)

    let actionProcessor

    if (action.type === 'sonos') {
      actionProcessor = new SonosAction(card, action)
    } else if (action.type === 'home_assistant') {
      actionProcessor = new HomeAssistantAction(card, action)
    } else if (action.type === 'channels') {
      actionProcessor = new ChannelsAction(card, action)
    } else if (action.type === 'script') {
      actionProcessor = new ScriptAction(card, action)
    }

    if (actionProcessor) {
      actionProcessor.process(room)
    }
  }
}

let cardProcessor = new CardProcessor()

module.exports = cardProcessor
