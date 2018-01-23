import { Model, Listen } from 'loong'

export const ADD_TODO = 'ADD_TODO'
export const DELETE_TODO = 'DELETE_TODO'
export const EDIT_TODO = 'EDIT_TODO'
export const COMPLETE_TODO = 'COMPLETE_TODO'
export const COMPLETE_ALL = 'COMPLETE_ALL'
export const CLEAR_COMPLETED = 'CLEAR_COMPLETED'
export const TODOS_CHANGE = 'TODOS_CHANGE'
export const SHOW_ALL = 'show_all'
export const SHOW_COMPLETED = 'show_completed'
export const SHOW_ACTIVE = 'show_active'

export default class Todos extends Model {
  constructor() {
    super()
    this.todos = []
  }
  @Listen(TODOS_CHANGE)
  getTodos() {
    return { todos: this.todos }
  }

  @Listen(ADD_TODO)
  add(todo) {
    if (!todo.text) {
      throw new Error('the todo must have the "text" value')
    }
    const id = this.todos.length + 1
    todo.id = id
    this.todos = [todo, ...this.todos]
    return { eventType: TODOS_CHANGE }
  }

  @Listen(EDIT_TODO)
  update({ id, text }) {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return { id, text }
      }
      return todo
    })
    return { eventType: TODOS_CHANGE }
  }

  @Listen(COMPLETE_TODO)
  complete({ id }) {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed }
      }
      return todo
    })
    return { eventType: TODOS_CHANGE }
  }

  @Listen(COMPLETE_ALL)
  completeAll() {
    const areAllMarked = this.todos.every(todo => todo.completed)
    this.todos = this.todos.map(todo => {
      todo.completed = !areAllMarked
      return todo
    })
    return { eventType: TODOS_CHANGE }
  }

  @Listen(CLEAR_COMPLETED)
  clearCompleted() {
    // this.todos = this.todos.map(todo => {
    //   if (todo.id === id) {
    //     return { ...todo, completed: false }
    //   }
    //   return todo
    // })
    return { todos: this.todos.filter(todo => !todo.completed) }
  }

  @Listen(DELETE_TODO)
  remove({ id }) {
    this.todos = this.todos.filter(todo => todo.id !== id)
    return { eventType: TODOS_CHANGE }
  }

  clean() {
    this.todos = []
  }
}
