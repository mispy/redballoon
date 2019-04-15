import React = require("react")
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { SignupForm } from './SignupForm'
import { ShowInviteLink } from './ShowInviteLink'

export class App extends React.Component {
    render() {
        return <Router>
            <Route exact path="/success/:userSlug" render={({ match }) => <ShowInviteLink userSlug={match.params.userSlug}/>}/>            
            <Route exact path="/:userSlug" render={({ match }) => <SignupForm referringUserSlug={match.params.userSlug}/>}/>
            <Route exact path="/" render={() => <SignupForm/>}/>
        </Router>
    }
}