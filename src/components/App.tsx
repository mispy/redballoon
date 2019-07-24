import React = require("react")
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { SignupForm } from './SignupForm'
import { ApplyForm, ApplySuccess } from './ApplyForm'
import { ShowInviteLink } from './ShowInviteLink'
import { AppState, AppContext } from "./AppContext"

export class App extends React.Component {
    state: AppState = new AppState()

    get childContext() {
        return { state: this.state }
    }

    render() {
        return <div id="app">
            <AppContext.Provider value={this.childContext}>
                <Router>
                    <Switch>
                        <Route exact path="/success/:userSlug" render={({ match }) => <ShowInviteLink userSlug={match.params.userSlug}/>}/>
                        <Route exact path="/apply-success" render={({ match }) => <ApplySuccess/>}/>
                        <Route exact path="/apply/:userSlug" render={({ match }) => <ApplyForm referringUserSlug={match.params.userSlug}/>}/>
                        <Route exact path="/apply" render={() => <ApplyForm/>}/>            
                        <Route exact path="/:userSlug" render={({ match }) => <SignupForm referringUserSlug={match.params.userSlug}/>}/>
                        <Route exact path="/" render={() => <SignupForm/>}/>
                    </Switch>
                </Router>
            </AppContext.Provider>
        </div>
    }
}