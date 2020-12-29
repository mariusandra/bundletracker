import React from 'react'
import ReactDOM from 'react-dom'
import { resetContext, getContext } from 'kea'
import { routerPlugin } from 'kea-router'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'

resetContext({
    plugins: [routerPlugin()],
})

ReactDOM.render(
    <Provider store={getContext().store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
