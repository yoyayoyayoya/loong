import TodosModel from './mock/TodosModel'
import {
  ADD_TODO,
  COMPLETE_TODO,
  UNDO_TODO,
  REMOVE_TODO
} from './mock/TodoEvents'
import Store from '../src/Store'

describe('Store tests', () => {
  describe('create a store with initState and single model', () => {
    it('should get the state "todos" from store', () => {
      const store = new Store({ value: 'value' }, { TodosModel })
      const state = store.getState()
      expect(state.todos).toBeDefined()
      expect(state.value).toBe('value')
    })
    it('should get the merged state "todos" from store', () => {
      const store = new Store({ value: 'value', todos: ['a'] }, { TodosModel })
      const state = store.getState()
      expect(state.todos).toBeDefined()
      expect(state.todos).toEqual(expect.arrayContaining(['a']))
    })
    it('should get the subscribers from TodoModel', () => {
      const store = new Store({}, { TodosModel })
      const subscribers = store.getSubscribers()
      const events = Object.keys(subscribers)
      const expectedEvents = [ADD_TODO, COMPLETE_TODO, UNDO_TODO, REMOVE_TODO]
      expect(events).toEqual(expect.arrayContaining(expectedEvents))
    })
    it('should get the correct model context from the related subscriber listener', () => {
      const store = new Store({}, { TodosModel })
      const subscribers = store.getSubscribers()
      for (let event in subscribers) {
        expect(subscribers[event].getListeners()[0]({})).toBe(TodosModel)
      }
    })
  })

  describe('publish the todo data { id: 1, text: "test" } for ADD_TODO event in store', () => {
    const data = { id: 1, text: 'test' }
    it('should get the merged new state', () => {
      TodosModel.clean()
      const store = new Store({}, { TodosModel })
      const state = store.getState()
      expect(state.todos).toHaveLength(0)
      store.publish(ADD_TODO, data)
      const newState = store.getState()
      expect(newState.todos).toHaveLength(1)
      expect(newState.todos[0]).toEqual(data)
    })
  })
})