const isPromise = require('is-promise')

class Subscriber {
  constructor(eventType, handler) {
    this.subscribeTotype = eventType
    this.name = `${eventType}:Subscriber`
    this.listeners = [handler]
  }
  addListener(handler) {
    this.listeners.push(handler)
  }
  getListeners() {
    return this.listeners
  }
  unsubscribe(handler) {
    this.listeners = this.listeners.filter(listener => listener !== handler)
  }
  unsubscribeAll() {
    this.listeners = []
  }
}

export default class PubSubable {
  constructor() {
    this.subscribers = {}
  }
  // leave them to be implementes by sub class
  beforeSubscribe() {}
  afterSubscribe() {}
  beforePublish() {}
  afterPublish(data) {
    return data
  }

  subscribe(eventType, handler) {
    if (this.beforeSubscribe(this, eventType, handler) === false) {
      return null
    }
    let subscriber = this.subscribers[eventType]
    if (subscriber) {
      subscriber.addListener(handler)
    } else {
      subscriber = this.subscribers[eventType] = new Subscriber(
        eventType,
        handler
      )
    }
    this.afterSubscribe(this, eventType, handler)
    return subscriber
  }
  getSubscribers() {
    return this.subscribers
  }
  /**
   *
   *
   * @param {Function(isPublishStoped, data)} callback
   * a data hook for publish, will pass the below params:
   * --
   *   isPublishStoped: indicate if current publish action is stoped
   *   data: the data handled by model
   */
  publish(eventType, data, callback = () => {}) {
    if (this.beforePublish(this, eventType, data) === false) {
      return callback(true, null)
    }
    const subscriber = this.subscribers[eventType]
    if (typeof subscriber === 'undefined') {
      throw new Error(
        `Could not find the related listener for event: ${eventType}`
      )
    }
    const listeners = subscriber.getListeners()

    for (let listener of listeners) {
      /**
       * the data is handled by model. it could be the promise object
       */
      if (isPromise(data)) {
        data.then(d => {
          this.afterPublish(d)
          listener(d)
          callback(false, d)
        })
      } else {
        this.afterPublish(data)
        listener(data)
        callback(false, data)
      }
    }
  }
}
