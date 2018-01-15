import { TodosModel } from './models'
import {
  ADD_TODO,
  ASYNC_ADD_TODO,
  COMPLETE_TODO,
  UNDO_TODO,
  REMOVE_TODO
} from './models/TodoEvents'
import Store from '../src/Store'

describe('Store tests', () => {
  TodosModel.clean()
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
    it('should get the event handlers from TodoModel', () => {
      const store = new Store({}, { TodosModel })
      const eventListeners = store.getEventListeners()
      const events = Object.keys(eventListeners)
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
    describe('publish the todo data { id: 1, text: "test" } for ADD_TODO event in store', () => {
      const data = { id: 1, text: 'test' }
      it('should be handled by TodosModel and get the merged new state', () => {
        TodosModel.clean()
        const store = new Store({}, { TodosModel })
        const state = store.getState()
        expect(state.todos).toHaveLength(0)
        let res = null
        const addTodoSubscriber = data => {
          res = data
        }
        store.subscribe(ADD_TODO, addTodoSubscriber)
        store.publish(ADD_TODO, data)
        const newState = store.getState()
        expect(newState.todos).toHaveLength(1)
        expect(newState.todos[0]).toEqual(data)
        expect(res.todos).toHaveLength(1)
        expect(res.todos[0]).toEqual(data)
      })
      it('should handle the async add event', done => {
        TodosModel.clean()
        const store = new Store({}, { TodosModel })
        const asyncListener = data => {
          const newState = store.getState()
          expect(newState.todos).toHaveLength(1)
          expect(newState.todos[0].text).toEqual('todo')
          expect(data.todos).toHaveLength(1)
          expect(data.todos[0].text).toEqual('todo')
          done()
        }
        store.subscribe(ASYNC_ADD_TODO, asyncListener)
        store.publish(ASYNC_ADD_TODO, { text: 'todo' })
      })
    })
  })
  describe('create a store without model', () => {
    it('should send the data to subscribers without any event listener', () => {
      const store = new Store()
      let expectedData = null
      const subscriber = data => {
        expectedData = data
      }
      const EVENT = 'e'
      store.subscribe(EVENT, subscriber)
      store.publish(EVENT, { name: 'name' })
      expect(expectedData.name).toEqual('name')
    })
  })
})
