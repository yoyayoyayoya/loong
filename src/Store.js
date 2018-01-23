import PubSubable from './PubSubable'
const isPromise = require('is-promise')

export default class Store extends PubSubable {
  constructor({ initState = {}, models = {}, plugins = [] } = {}) {
    super({ plugins })
    this.state = this.intiStateFromModels(initState, models)
    this.models = models
    this.injectPublishMethodToModels(this.models)
    this.eventListeners = this.createEventListnersByModels(models)
  }

  /**
   * extract the state from the data models and merge it with initState
   * @param {Object} initState the initical state
   * @param {Object} models composed models
   */
  intiStateFromModels(initState, models) {
    let modelState = {}
    let model = null
    for (let name in models) {
      model = models[name]
      modelState = Object.assign(modelState, model)
    }
    return Object.assign(modelState, initState)
  }

  getEventListeners() {
    return this.eventListeners
  }

  createEventListnersByModels(models) {
    let allListeners = []
    let eventListeners = {}
    let model = null
    for (let name in models) {
      model = models[name]
      allListeners = allListeners.concat(model.getEventListeners())
    }
    for (let event of allListeners) {
      eventListeners[event.eventType] = event.fn
    }
    return eventListeners
  }

  handlerEventByModel(eventType, data) {
    const handler = this.eventListeners[eventType]
    if (handler) {
      return handler(data)
    } else {
      return data
    }
  }

  injectPublishMethodToModels(models) {
    let model = null
    for (let name in models) {
      model = models[name]
      model.publish = this.publish.bind(this)
    }
  }

  /**
   * The state could only be mutated by subscription events.
   * This method is the only way to get state.
   * After event published, getState method can provide the merged new state
   */
  getState() {
    return this.state
  }

  subscribe(eventType, data) {
    if (this.beforeSubscribe(eventType, data) === false) {
      this.afterSubscribe(eventType, data)
      return
    }
    let subscriber = super.subscribe(eventType, data)
    this.afterSubscribe(eventType, data)
    return subscriber
  }

  /**
   * The models in charge of handling event data, and then trasport them to the
   * subscribers of event. We override the parent publish method so that the
   * models could handle event data before sending it to subscribers.
   * @override PubSubable#publish
   * @param {String} eventType event type which be catched by models and subscribers
   * @param {String} data the event data sent by store users
   * @param {Function} callback normally, the new state
   * could only be broadcasted the all related subscribers. But callback could
   * another chance to get the new state
   */
  publish(eventType, data, callback = () => {}) {
    if (this.beforePublish(eventType, data) === false) {
      this.afterPublish(eventType, data)
      return
    }
    const me = this
    const newData = this.handlerEventByModel(eventType, data)

    /**
     * if the property 'eventType' in the newData, it means that there is a new
     * event should be republished.
     */

    if (isPromise(newData)) {
      newData.then(d => {
        if (d && d.eventType) {
          return me.publish(d.eventType, d.data, callback)
        }
        me.state = Object.assign(this.state, d)
        callback(me.state)
        super.publish(eventType, d, callback)
        me.afterPublish(eventType, { data, newData: d })
      })
    } else {
      if (newData && newData.eventType) {
        return me.publish(newData.eventType, newData.data, callback)
      }
      me.state = Object.assign(this.state, newData)
      callback(me.state)
      super.publish(eventType, newData, callback)
      me.afterPublish(eventType, { data, newData })
    }
  }
}
