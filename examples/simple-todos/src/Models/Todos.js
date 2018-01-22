import { Model, Listen } from 'loong'

export const events = {
  ADD_TODO: 'add_todo',
  UPDATE_TODO: 'update_todo',
  COMPLETE_TODO: 'compolete_todo',
  UNDO_TODO: 'undo_todo',
  REMOVE_TODO: 'remove_todo',
  FILTER_TODOS: 'filter_todos',
  TODOS_CHANGE: 'todos_change'
}

export default class Todos extends Model {
  constructor() {
    super()
    this.todos = []
  }
  @Listen(events.TODOS_CHANGE)
  getTodos() {
    return { todos: this.todos }
  }

  @Listen(events.ADD_TODO)
  add(todo) {
    if (!todo.text) {
      throw new Error('the todo must have the "text" value')
    }
    const id = this.todos.length + 1
    todo.id = id
    this.todos = [todo, ...this.todos]
    return { eventType: events.TODOS_CHANGE }
  }

  @Listen(events.UPDATE_TODO)
  update({ id, text }) {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return { id, text }
      }
      return todo
    })
    return { todos: this.todos }
  }

  @Listen(events.COMPLETE_TODO)
  complete({ id }) {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true }
      }
      return todo
    })
    return { todos: this.todos }
  }

  @Listen(events.UNDO_TODO)
  undo({ id }) {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: false }
      }
      return todo
    })
    return { todos: this.todos }
  }

  @Listen(events.REMOVE_TODO)
  remove({ id }) {
    this.todos = this.todos.filter(todo => todo.id !== id)
    return { todos: this.todos }
  }

  @Listen(events.FILTER_TODOS)
  filter({ q }) {
    const res = this.todos.filter(todo => {
      return todo.text.indexOf(q) > -1
    })
    return { todos: res }
  }

  clean() {
    this.todos = []
  }
}
