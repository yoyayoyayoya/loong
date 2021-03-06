import Store from './Store'

/**
 * Store factory. User could get the store by this createStore only
 * @author yoya
 * @param {Object} models composed state models
 * @return {Store}
 */
export default function createStore({ initState, models, plugins }) {
  const store = new Store({ initState, models, plugins })
  return store
}
