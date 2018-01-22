import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

import { createStore } from 'loong'
import { Provider } from 'react-loong'

import TodoModule from './components/TodoModule'
import TodosModel from './Models/Todos'

const store = createStore({ models: { TodosModel: new TodosModel() } })

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <TodoModule />
        </div>
      </Provider>
    )
  }
}

export default App
