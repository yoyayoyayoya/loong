import Model from '../../src/Model'
import Listen from '../../src/annotations/Listen'
import {
  ADD_TODO,
  ASYNC_ADD_TODO,
  UPDATE_TODO,
  COMPLETE_TODO,
  UNDO_TODO,
  REMOVE_TODO,
  FILTER_TODOS,
  TODOS_CHANGE,
  FIRE_CHANGE
} from './TodoEvents'

class TodoModel extends Model {
  constructor() {
    super()
    this.todos = []
  }
  @Listen(ADD_TODO)
  add(todo) {
    if (!todo.text) {
      throw new Error('the todo must have the "text" value')
    }
    const id = this.todos.length + 1
    todo.id = id
    this.todos = [todo, ...this.todos]
    return { todos: this.todos }
  }

  @Listen(ASYNC_ADD_TODO)
  asyncAdd(todo) {
    const me = this
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          resolve(me.add(todo))
        }, 0)
      } catch (e) {
        reject(e)
      }
    })
  }

  @Listen(UPDATE_TODO)
  update({ id, text }) {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return { id, text }
      }
      return todo
    })
    return { todos: this.todos }
  }

  @Listen(COMPLETE_TODO)
  complete({ id }) {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true }
      }
      return todo
    })
    return { todos: this.todos }
  }

  @Listen(UNDO_TODO)
  undo({ id }) {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: false }
      }
      return todo
    })
    return { todos: this.todos }
  }

  @Listen(REMOVE_TODO)
  remove({ id }) {
    this.todos = this.todos.filter(todo => todo.id !== id)
    return { todos: this.todos }
  }

  @Listen(FILTER_TODOS)
  filter({ q }) {
    const res = this.todos.filter(todo => {
      return todo.text.indexOf(q) > -1
    })
    return { todos: res }
  }

  @Listen(FIRE_CHANGE)
  fireChange(data) {
    const res = { eventType: TODOS_CHANGE, data: data.data }
    if (data.isAsync) {
      return new Promise((resolve, reject) => {
        try {
          setTimeout(() => {
            resolve(res)
          }, 0)
        } catch (e) {
          reject(e)
        }
      })
    } else {
      return res
    }
  }

  @Listen(TODOS_CHANGE)
  listenChange(data) {
    return data
  }

  clean() {
    this.todos = []
  }
}

export default new TodoModel()
