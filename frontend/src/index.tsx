import React from 'react'
import ReactDOM from 'react-dom'
import { resetContext, getContext } from 'kea'
import { routerPlugin } from 'kea-router'
import { windowValuesPlugin } from 'kea-window-values'
import { Provider } from 'react-redux'
import { App } from './scenes/app/App'

resetContext({
    plugins: [routerPlugin(), windowValuesPlugin({ window: window })],
})

ReactDOM.render(
    <Provider store={getContext().store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
