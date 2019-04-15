import React = require("react")
import { action, observable, computed, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import { Redirect } from "react-router-dom";
import md5 = require('md5')
const slugify = require('slugify')

import { savePerson } from '../api'

@observer
export class SignupForm extends React.Component<{ referringUserSlug?: string }> {
    @observable email: string = ""// = "jaiden@mispy.me"
    @observable name: string = ""// = "Jaiden Mispy"
    @observable isLoading: boolean = false
    @observable loadingButton: string = ''
    @observable error?: string
    @observable redirectTo?: string

    async save() {
        try {
            this.isLoading = true
            const res = await savePerson({ name: this.name, email: this.email, referringUserId: this.referringUser ? this.referringUser.id : "none" })
            runInAction(() => {
                if (this.loadingButton === 'invite')
                    this.redirectTo = `/success/${slugify(this.name)}-${res.userId}`
                else
                    window.location.replace("https://www.helixnano.com/jobs")
            })
        } catch (err) {
            console.error(err)
            runInAction(() => {
                this.error = err.message
            })
            throw err
        } finally {
            runInAction(() => this.isLoading = false)
        }
    }

    @action.bound onSubmit(ev: React.FormEvent) {
        ev.preventDefault()
        this.save()
    }

    @computed get referringUser() {
        if (!this.props.referringUserSlug) return undefined

        const spl = this.props.referringUserSlug.split(/-/g)

        return {
            name: this.props.referringUserSlug.replace(/-[^-]+$/, "").replace(/-/g, ' '),
            id: spl[spl.length-1]
        }
    }

    @action.bound onEmail(ev: React.ChangeEvent<HTMLInputElement>) {
        this.email = ev.target.value
    }

    @action.bound onName(ev: React.ChangeEvent<HTMLInputElement>) {
        this.name = ev.target.value
    }

    @action.bound onApply() {
        this.loadingButton = 'apply'
    }

    @action.bound onGetInvite() {
        this.loadingButton = 'invite'
    }

    render() {
        return <React.Fragment>
            {this.redirectTo && <Redirect to={this.redirectTo}/>}
            <h1>Help us find an immunotherapy researcher and win money</h1>
            <p>Helix Nanotechnologies is looking for an experienced scientist to lead the development of personalized cancer vaccines.</p>
            <p>We're giving <b>$2000</b> to the successful candidate, <b>$1000</b> to the person who invited them, <b>$500</b> to whoever invited the inviter, and so on.</p>
            <p>Sign up to join the search:</p>
            <form method="POST" onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" className="form-control" placeholder="Your name" onChange={this.onName} value={this.name} required disabled={this.isLoading}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" name="email" type="email" className="form-control" placeholder="Your email" onChange={this.onEmail} value={this.email} required disabled={this.isLoading}/>
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
                {(this.isLoading && this.loadingButton === 'apply') ?
                    <button className="btn btn-light" type="button" disabled={this.isLoading}>
                        <span>Apply for the position </span>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="sr-only">Loading...</span>
                    </button>
                    :
                    <input type="submit" value="Apply for the position" className="btn btn-light" onClick={this.onApply}/>
                }
            </form><br/>
            {this.error ? <div className="alert alert-danger">{this.error}</div> : undefined}
            {this.referringUser ? <p>You are being invited by <strong>{this.referringUser.name}</strong>. If you find our researcher, both you and {this.referringUser.name} will win money.</p> : undefined}
        </React.Fragment>
    }
}