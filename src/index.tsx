import React = require('react')
import ReactDOM = require('react-dom')
import { SignupForm } from './components/SignupForm'
import './index.scss'

function main() {
    ReactDOM.render(<SignupForm/>, document.querySelector("#root"))
}
main()