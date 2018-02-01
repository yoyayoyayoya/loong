# Long

Loong is a simple state management lib. It could helps you manage your state based on models and Pub/Sub pattern.

[![Build Status](https://travis-ci.org/yoyayoyayoya/loong.svg?branch=master)](https://travis-ci.org/yoyayoyayoya/loong)
[![codecov](https://codecov.io/gh/yoyayoyayoya/loong/branch/master/graph/badge.svg)](https://codecov.io/gh/yoyayoyayoya/loong)
[![npm](https://img.shields.io/npm/dm/loong.svg)](https://www.npmjs.com/package/loong)
[![npm](https://img.shields.io/npm/dt/loong.svg)](https://www.npmjs.com/package/loong)
[![npm](https://img.shields.io/npm/l/loong.svg)]()
[![npm](https://img.shields.io/npm/v/npm.svg)]()

## Introduces

Althought there are so many state management libs such as Redux, Flex, Mobox and so on. You will find lots of them are not focus on model strongly.

The model in MV\* pattern is a very important factor actually. We rely on it to provide the business data services, expect it to handle the business logic. I have been asking myself about why the developments of MV\* still is a diffcult task even if we have the smart frameworks(React, Vue...). WHY? You may got the answer to it or not. I got it of my own. Just like I said above. We are ignoring and missing the model in it. So I am trying to change it and create the new state management lib **Loong**.

It is a Redux alike lib followd the flex pattern. The different part is it based on _Model_ insteading of reducers. The _Model_ will give you a clearer picture of your state. Comparing to pure reducer fuction. The _Model_ also has the predictable, testable features.

## Conecpts

* [Pub/Sub pattern](#pubsub-pattern)
* [Event](#event)
* [Model](#model)
* [Plugins](#plugins)

### Pub/Sub pattern

The Loong lib use the Pub/Sub pattern as the critical approach to process the business data. Any component could subscribe the event published by others. In the mean time. The component could publish the event with the data for getting helps from model.

### Event

It looks like the action in React or other Flux alike libs. But I would like to use the event driven approach not action to coordinate data flow between components.

### Model

The model is most important concept of Loong. Any data processing must go thought it as same as the filter and helpers. Each event data should be handled by model first. Unless you just want pass it to other subscribers.

There is one thing you should to know. _**All states could be defined in the model only**_. You don't have another place to define it. More details you can find in the [How to use it](### How to use it) section.

### Data flow

1. The component publish the event with data.
2. The model catches the event, handling it in async or sync way. and return the processed data.
3. The all components subscribed that event will be notified and be trigged to do somethings by data.

## Tools

Currently I implemented a tool for React..

[React-loong](https://github.com/yoyayoyayoya/react-loong).

## Plugins (coming soon)

### Install

```bash
> npm install --save loong react-loong
or
> yarn add loong react-loong
```

### How to use it

(1). Create a model extends the Model class.  
(2). Define the states in the model. it is very simple. The properties are just the states.  
(3). Put the Listener annotaion with event type to the method you want it to handle data.  
(4). After that. you should return the data with the state. Or the subscribers will not be got the latest state if you don't return it.  
(5). The Loong provide a way to help model to get helps from other models. you just return the data with the event type and data. The Loong will publish it to the model which could handle the event you send.

```javascript
import { Model, Listen } from 'loong'

// define the event types here
export const ADD_TODO = 'ADD_TODO'
...

export default class Todos extends Model {
  constructor() {
    super()
    // the properties will become the states automatically
    this.todos = []
  }

  // use the Listen annotaion to catch event.
  @Listen(ADD_TODO)
  add(todo) {
    if (!todo.text) {
      throw new Error('the todo must have the "text" value')
    }
    const id = this.todos.length + 1
    todo.id = id
    this.todos = [todo, ...this.todos]
    return { todo: this.todos}
  }
  /**
    for SOME_EVENT. you might want to get helps from other models such as helping you send the ajax request. Let's say the model will publish the event RESULT. Any component subscribed that event will be reacted to do somethings.
  */
  @Listen(SOME_EVENT)
  getHelps(data){
    return { eventType: OTHER_EVENT, data }
  }

  /**
    you can also Listen the event, for example here is RESULT, to get the result.
  */
  @Listen(RESULT)
  handleResult(data){
    return {todos: data}
  }
  ...
}
```

(6). Create a provider as the contianer.  
(7). The createStore accept a json parameter. you can set the initState, models and plugins(coming soon).

```javascript
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-loong'
import { createStore } from 'loong'
import App from './containers/App'
import TodosModel from './Models/Todos'

const models = {
  todosModel: new TodosModel()
}
const initState = {
  todos: [{ text: 'empty here' }]
}
const store = createStore({ initState, models })

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

(8). Add the HOC 'withLoong' to your component and subcribe the events. The events is a array . If the events is empty or nothing. That'means the component is just publishable. Your component will get the publish fuction within properties. you could use it to publish event. The publishing data must contains the eventType and data properties.

```javascript
import React from 'react'
import { withLoong } from 'react-loong'
import * as events from '../Models/Todos'

@withLoong([events.TODO_ADD, ...other events])
class TodoComponent extends React.Component{
  completeTodo(){
    const todo = ...
    this.props.publish({ eventType:events.COMPLETE_TODO, data: { todo } })
  }
  render(){
    return ...
  }
}
```

(9). Ready to go!

### Example

You can get the more details and usages in here.
[TodoMvc](https://github.com/yoyayoyayoya/loong/tree/master/examples/todomvc)
