import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-loong'
import { createStore } from 'loong'
import App from './containers/App'
import 'todomvc-app-css/index.css'
import TodosModel from './Models/Todos'

const models = {
  todosModel: new TodosModel()
}
const store = createStore({ models })

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
