import React = require("react")
import { action, observable, computed, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import { Redirect } from "react-router-dom";
import md5 = require('md5')
const slugify = require('slugify')

import { savePerson } from '../api'

@observer
export class SignupForm extends React.Component<{ referringUserSlug: string }> {
    @observable email: string = ""// = "jaiden@mispy.me"
    @observable name: string = ""// = "Jaiden Mispy"
    @observable outputUserId?: string
    @observable isLoading: boolean = false

    async save() {
        try {
            this.isLoading = true
            const res = await savePerson({ name: this.name, email: this.email, referringUserId: this.referringUserId })
            runInAction(() => this.outputUserId = res.userId)
        } catch (err) {
            // TODO
            throw err
        } finally {
            runInAction(() => this.isLoading = false)
        }
    }

    @action.bound onSubmit(ev: React.FormEvent) {
        ev.preventDefault()
        this.save()
    }

    @computed get referringUserId() {
        const spl = this.props.referringUserSlug.split(/-/g)
        return spl[spl.length-1]
    }

    @computed get referringUserName() {
        return this.props.referringUserSlug.replace(/-[^-]+$/, "").replace(/-/g, ' ')
    }

    @computed get outputUserSlug(): string|undefined {
        return this.outputUserId ? `${slugify(this.name)}-${this.outputUserId}` : undefined
    }

    @action.bound onEmail(ev: React.ChangeEvent<HTMLInputElement>) {
        this.email = ev.target.value
    }

    @action.bound onName(ev: React.ChangeEvent<HTMLInputElement>) {
        this.name = ev.target.value
    }

    componentDidUpdate() {
        this.outputUserId = undefined
    }

    render() {
        console.log(this.props.referringUserSlug)

        return <React.Fragment>
            {this.outputUserSlug && <Redirect to={this.outputUserSlug}/>}
            <h2>Sign up</h2>
            <form method="POST" onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" name="email" type="email" className="form-control" placeholder="Your email" onChange={this.onEmail} value={this.email} required disabled={this.isLoading}/>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" className="form-control" placeholder="Your name" onChange={this.onName} value={this.name} required disabled={this.isLoading}/>
                </div>
                {this.isLoading ?
                    <button className="btn btn-primary" type="button" disabled={this.isLoading}>
                        <span>Get referral link </span>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="sr-only">Loading...</span>
                    </button>
                    :
                    <input type="submit" value="Get referral link" className="btn btn-primary" />
                }
            </form>
            <br/><p>You are being referred by <b>{this.referringUserName}</b>.</p>
        </React.Fragment>
    }
}