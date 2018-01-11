import Pubsub from './pubsub'

class Store {
  constrctor(initState = {}, stateUpdater) {
    const me = this
    me.state = Object.assign({}, initState)
    me.stateUpdater = stateUpdater
  }
  getState() {
    return this.state
  }
  setState(state) {
    this.state = state
    this.stateUpdater && this.stateUpdater(state)
  }
}

/**
 * Creates a Yoya store which
 * @param {Object} models composed model definations
 */
export default function createStore(initState, stateUpdater) {
  const updateStoreState = (_, eventType, data) => {
    store.setState(Object.assign(store.getState(), data))
  }
  const store = new Store(initState)
  Pubsub.addHooks({ afterPublish: updateStoreState })
  return store
}
