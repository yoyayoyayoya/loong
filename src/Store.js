import PubSubable from './PubSubable'

export default class Store extends PubSubable {
  constructor(initState = {}, models = {}) {
    super()
    this.state = this.extractStateFromModels(initState, models)
    this.models = models
    this.createSubscribersByModels(models)
  }

  extractStateFromModels(initState, models) {
    let modelState = {}
    let model = null
    for (let name in models) {
      model = models[name]
      modelState = Object.assign(modelState, model)
    }
    return Object.assign(modelState, initState)
  }

  createSubscribersByModels(models) {
    let eventListeners = []
    let model = null
    for (let name in models) {
      model = models[name]
      eventListeners = eventListeners.concat(model.getEventListeners())
    }
    const subscribe = this.subscribe.bind(this)
    for (let event of eventListeners) {
      subscribe(event.eventType, event.fn)
    }
  }

  getState() {
    return this.state
  }

  afterPublish(newState) {
    this.state = Object.assign(this.state, newState)
    return this
  }
}
