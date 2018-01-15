import TodosModel from '../models/TodosModel'
import {
  ADD_TODO,
  UPDATE_TODO,
  COMPLETE_TODO,
  UNDO_TODO,
  REMOVE_TODO,
  FILTER_TODOS
} from '../models/TodoEvents'
import { createStore } from '../../src'

describe('Mocking Todos App Tests', () => {
  TodosModel.clean()
  const store = createStore({}, { TodosModel })
  let componentState = {}
  //mock the TodoList components
  const TodoList = state => {
    componentState = state
  }
  // store helps components subscribing events.
  store.subscribe(ADD_TODO, TodoList)
  store.subscribe(UPDATE_TODO, TodoList)
  store.subscribe(COMPLETE_TODO, TodoList)
  store.subscribe(UNDO_TODO, TodoList)
  store.subscribe(REMOVE_TODO, TodoList)
  store.subscribe(FILTER_TODOS, TodoList)

  describe('create a new todo', () => {
    it('should update the todo list and state of store', () => {
      store.publish(ADD_TODO, { text: 'todo_new' })
      expect(componentState.todos.length).toEqual(1)
      expect(componentState.todos[0].text).toEqual('todo_new')
      const state = store.getState()
      expect(state.todos.length).toEqual(1)
      expect(state.todos[0].text).toEqual('todo_new')
      expect(state.todos).toBe(componentState.todos)
    })
  })

  describe('update a todo', () => {
    it('should update the todos', () => {
      store.publish(UPDATE_TODO, { id: 1, text: 'todo' })

      expect(componentState.todos.length).toEqual(1)
      expect(componentState.todos[0].text).toEqual('todo')
      const state = store.getState()
      expect(state.todos.length).toEqual(1)
      expect(state.todos[0].text).toEqual('todo')
      expect(state.todos).toBe(componentState.todos)
    })
  })

  describe('mark completed or undo the todo', () => {
    it('should completed the todo', () => {
      store.publish(COMPLETE_TODO, { id: 1 })
      expect(componentState.todos.length).toEqual(1)
      expect(componentState.todos[0].isCompleted).toEqual(true)
      const state = store.getState()
      expect(state.todos).toBe(componentState.todos)
    })

    it('should undo the todo', () => {
      store.publish(UNDO_TODO, { id: 1 })
      expect(componentState.todos.length).toEqual(1)
      expect(componentState.todos[0].isCompleted).toEqual(false)
      const state = store.getState()
      expect(state.todos).toBe(componentState.todos)
    })
  })

  describe('remove a todo', () => {
    it('should remove the todo', () => {
      store.publish(REMOVE_TODO, { id: 1 })
      expect(componentState.todos.length).toEqual(0)
      const state = store.getState()
      expect(state.todos.length).toEqual(0)
      expect(state.todos).toBe(componentState.todos)
    })
  })

  describe('filter todos', () => {
    it('should filter the todos by q', () => {
      TodosModel.clean()
      store.publish(ADD_TODO, { text: 'todo1' })
      store.publish(ADD_TODO, { text: 'todo2' })
      store.publish(ADD_TODO, { text: 'todo3' })
      store.publish(ADD_TODO, { text: 'others' })
      expect(componentState.todos.length).toEqual(4)
      store.publish(FILTER_TODOS, { q: 'to' })
      expect(componentState.todos.length).toEqual(3)
      store.publish(FILTER_TODOS, { q: 'ot' })
      expect(componentState.todos.length).toEqual(1)
    })
  })
})
