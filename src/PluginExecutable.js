import Pluginable from './Pluginable'

export default class PluginExuable extends Pluginable {
  constructor(plugins) {
    super()
    this.plugins = plugins
  }
  beforeSubscribe(eventType, data) {
    let isContinue = true
    for (let plugin of this.plugins) {
      isContinue = plugin.beforeSubscribe(eventType, data)
      break
    }
    return isContinue
  }
  afterSubscribe(eventType, data) {
    for (let plugin of this.plugins) {
      plugin.afterSubscribe(eventType, data)
    }
  }
  beforePublish(eventType, data) {
    let isContinue = true
    for (let plugin of this.plugins) {
      isContinue = plugin.beforePublish(eventType, data)
      break
    }
    return isContinue
  }
  afterPublish(eventType, data) {
    for (let plugin of this.plugins) {
      plugin.afterPublish(eventType, data)
    }
  }
}
