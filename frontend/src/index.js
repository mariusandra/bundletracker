import React from 'react'
import ReactDOM from 'react-dom'
import { resetContext, getContext } from 'kea'
import { routerPlugin } from 'kea-router'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

resetContext({
    plugins: [routerPlugin()],
})

fetch('/bundle.json')
    .then((res) => res.json())
    .then(console.log)

ReactDOM.render(
    <Provider store={getContext().store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
