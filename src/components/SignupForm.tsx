import React = require("react")
import { action, observable, computed, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import { Redirect, Link } from "react-router-dom"

import { savePerson } from '../api'
import { AppContext } from "./AppContext"
import { parseReferrer } from "../utils"

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
            <h1>Help us hire a brilliant immunotherapy scientist and win money!</h1>
            <p>Helix Nanotechnologies needs you! We recently launched <a href="https://medium.com/@hannu_64912/helixnano-announces-grant-from-schmidt-futures-to-pursue-personalized-cancer-vaccines-323cbbd6bee0">a project backed by Eric Schmidt</a> to supercharge future cancer immunotherapies. Now we need a pioneering scientist to lead it, with the right attitude and skills -- <a href="https://www.helixnano.com/jobs">full role description here</a>.</p>
            <p>You can help us find them. By signing up below with the <em className="text-primary">blue button</em>, you'll get an invite link that you can forward to smart friends in the field, post on Twitter/Facebook/LinkedIn, send to mailing lists of academic departments, or anything else you can think of to find the best candidate.</p>
            <p>It'll be worth your while. We're giving $2000 to the successful candidate, $1000 to the person who invited them to apply, $500 to whoever invited the inviter, and so on. So the more people you recruit to sign up to the search, the higher your chances to win a share of the prize.</p>
            <p>Or if you think <em>you</em> are the right person for the job, just apply using the <em className="text-success">green button</em> below.</p>
            <p>With your help, we may be able to make a difference to cancer patients around the world. Happy hunting!</p>
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