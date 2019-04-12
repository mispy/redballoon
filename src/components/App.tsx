import React = require("react")
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'

import { SignupForm } from './SignupForm'

export class App extends React.Component {
    render() {
        return <Router>
            <Route exact path="/:userSlug" render={({ match }) => <SignupForm referringUserSlug={match.params.userSlug}/>}/>
            <Route exact path="/" render={() => <Redirect to="/Jaiden-Mispy-229439321632932353"/>}/>
        </Router>
    }
}