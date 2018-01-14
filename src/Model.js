/**
 * Model
 * --
 *   The most import class of lib. Users could extend it to create the model of
 * their own. The purposes of Model designing are:
 *   1. each Model propery will be parts of state data naturally.
 * (call it state-property).
 *   it helps users to organize their state easily in a straightforward way.
 *   In other word, you need define the none-state property as enumerable
 * (@refers to definition of "eventListenrs" on the below).
 *
 *   2. one model could fire the event by publish method to other model to get
 * some helps.
 *
 *   3. Model listener could only the current state object.
 *   for example:
 *   class Todos extends Model {
 *     constructor(){
 *       this.todos = []
 *     }
 *     @Listen(ADD_TODO)
 *     add(todo) {
 *      const newTodos = [todo, ...this.todos]
 *      return {todos: newTodos}
 *    }
 *    other(todo){..., return {Any}}
 *    ...
 *   }
 *   The #add(todo) method can only return the object contains todo or todos.
 * But the #other(todo) method don't this limition. It is the kind of modle
 * helpers.
 *
 *  4. Model must difines state data schemas, It's be used to do the data
 * validations.
 *  The schemas be contains in return object of #getCOnfig() with 'schemas'
 * property using PropTypes lib.
 *  for example:
 *  import PropTypes from 'PropTypes'
 *  ...
 *  getConfig(){
 *    return {
 *      schemas: {
 *        name: PropTypes.string.isRequired
 *        address: PropTypes.string
 *        ...
 *      }
 *    }
 *  }
 */

export default class Model {
  /**
   * Rebind the each linstener and return all of them.
   * --
   *   In order to make the method works normally, Each linstener will be binded
   * the scope back to its owner.
   *
   * @return {Array} eventListenrs
   */
  getEventListeners() {
    for (let listener of this.eventListeners) {
      if (this[listener.fn]) {
        listener.fn = this[listener.fn].bind(this)
      }
    }
    return this.eventListeners
  }
  /**
   * Todo: to return the event listener configurations, such as timeout, competition
   * strategies, state schemas etc.
   */
  getConfig() {
    return null
  }

  /**
   * Interface. Make the Model be able to publish event data.
   */
  publish() {}
}
/**
 * Create a eventListenrs for regeistering purpose to each Model instance
 * it is not enumerable, which means it can't be accessed by Object.keys
 * why?
 * --
 *   Each property of model will be parts of state of store. so the otherunecessary
 * properties should not be enumerable. Due to the method in class defination is
 * unenmerable. So we only focus on the property of our own.
 */
Object.defineProperty(Model.prototype, 'eventListeners', {
  value: [],
  enumerable: false,
  configurable: true,
  writable: true
})
