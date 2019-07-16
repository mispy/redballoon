import React = require("react")
import { action, observable, computed, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import { Redirect, Link } from "react-router-dom"

import { savePerson } from '../api'
import { AppContext } from "./AppContext"
import { parseReferrer } from "../utils";

@observer
export class SignupForm extends React.Component<{ referringUserSlug?: string }> {
    static contextType = AppContext

    @observable isLoading: boolean = false
    @observable loadingButton: string = ''
    @observable error?: string
    @observable redirectTo?: string

    async save() {
        try {
            this.isLoading = true
            const res = await savePerson({ name: this.context.state.name, email: this.context.state.email, referringUserId: this.referringUser ? this.referringUser.id : "none" })
            runInAction(() => {
                if (this.loadingButton === 'invite')
                    this.redirectTo = `/success/${encodeURIComponent(this.context.state.name).replace(/%20/g, "+")}-${res.userId}`
                else
                    this.redirectTo = `/apply`
            })
        } catch (err) {
            console.error(err)
            runInAction(() => {
                this.isLoading = false
                this.error = err.message
            })
            throw err
        }
    }

    @action.bound onSubmit(ev: React.FormEvent) {
        ev.preventDefault()
        this.save()
    }

    @computed get referringUser() {
        const { referringUserSlug } = this.props
        return referringUserSlug ? parseReferrer(referringUserSlug) : undefined
    }

    @action.bound onEmail(ev: React.ChangeEvent<HTMLInputElement>) {
        this.context.state.email = ev.target.value
    }

    @action.bound onName(ev: React.ChangeEvent<HTMLInputElement>) {
        this.context.state.name = ev.target.value
    }

    @action.bound onApply() {
        this.loadingButton = 'apply'
    }

    @action.bound onGetInvite() {
        this.loadingButton = 'invite'
    }

    render() {
        return <React.Fragment>
            {this.redirectTo && <Redirect push to={this.redirectTo}/>}
            <h1>Help us find an immunotherapy researcher and win money</h1>
            <p>Helix Nanotechnologies is looking for an experienced scientist to lead the development of personalized cancer vaccines.</p>
            <p>We're giving <b>$2000</b> to the successful candidate, <b>$1000</b> to the person who invited them, <b>$500</b> to whoever invited the inviter, and so on.</p>
            <p>Sign up to join the search:</p>
            <form method="POST" onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" className="form-control" placeholder="Your full name" onChange={this.onName} value={this.context.state.name} required disabled={this.isLoading}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" name="email" type="email" className="form-control" placeholder="Your email" onChange={this.onEmail} value={this.context.state.email} required disabled={this.isLoading}/>
                </div>
                {(this.isLoading && this.loadingButton === 'invite') ?
                    <button className="btn btn-primary" type="button" disabled={this.isLoading}>
                        <span>Get invite link </span>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="sr-only">Loading...</span>
                    </button>
                    :
                    <input type="submit" value="Get invite link" className="btn btn-primary" onClick={this.onGetInvite}/>
                }
                <em>-or-</em>
                <Link to={`/apply${this.props.referringUserSlug ? "/"+this.props.referringUserSlug : ""}`}><button className="btn btn-success" disabled={this.isLoading}>Apply for the position</button></Link>
            </form><br/>
            {this.error ? <div className="alert alert-danger">{this.error}</div> : undefined}
            {this.referringUser ? <p>You are being invited by <strong>{this.referringUser.name}</strong>. If you find our researcher, both you and {this.referringUser.name} will win money.</p> : undefined}
        </React.Fragment>
    }
}