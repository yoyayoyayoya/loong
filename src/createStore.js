import Store from './Store'

/**
 * Creates a loong store
 * @param {Object} models composed state models
 */
export default function createStore(initState, models) {
  const store = new Store(initState, models)
  delete store.extractStateFromModels
  delete store.createSubscribersFromModelByEvent
  return store
}
