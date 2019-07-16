import React = require("react")
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { SignupForm } from './SignupForm'
import { ApplyForm } from './ApplyForm'
import { ShowInviteLink } from './ShowInviteLink'

export class App extends React.Component {
    render() {
        return <Router>
            <Switch>
                <Route exact path="/success/:userSlug" render={({ match }) => <ShowInviteLink userSlug={match.params.userSlug}/>}/>            
                <Route exact path="/apply" render={({ match }) => <ApplyForm/>}/>            
                <Route exact path="/:userSlug" render={({ match }) => <SignupForm referringUserSlug={match.params.userSlug}/>}/>
                <Route exact path="/" render={() => <SignupForm/>}/>
            </Switch>
        </Router>
    }
}