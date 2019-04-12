import React = require('react')
import ReactDOM = require('react-dom')
import { App } from './components/App'
import './index.scss'

function main() {
    ReactDOM.render(<App/>, document.querySelector("#root"))
}
main()