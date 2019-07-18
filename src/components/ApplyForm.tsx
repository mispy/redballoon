import React = require("react")
import { action, observable, computed, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import { Redirect } from "react-router-dom"

import { applyForPosition } from '../api'
import { AppContext } from './AppContext'
import { parseReferrer } from "../utils"

@observer
export class ApplyForm extends React.Component<{ referringUserSlug?: string }> {
    static contextType = AppContext

    @observable coverLetter: string = ""
    @observable cvFile: { filename: string, contentType: string, dataUri: string }|null = null

    @observable isLoading: boolean = false
    @observable error?: string
    @observable redirectTo?: string

    async save() {
        if (!this.cvFile) return

        try {
            this.isLoading = true
            await applyForPosition({ 
                email: this.context.state.email,
                name: this.context.state.name, 
                referringUser: this.referringUser,
                coverLetter: this.coverLetter,
                cvFile: this.cvFile
            })
            runInAction(() => {
                this.redirectTo = `/apply-success`
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

    @computed get referringUser() {
        const { referringUserSlug } = this.props
        return referringUserSlug ? parseReferrer(referringUserSlug) : undefined
    }

    @action.bound onSubmit(ev: React.FormEvent) {
        ev.preventDefault()
        this.save()
    }

    @action.bound onEmail(ev: React.ChangeEvent<HTMLInputElement>) {
        this.context.state.email = ev.target.value
    }

    @action.bound onName(ev: React.ChangeEvent<HTMLInputElement>) {
        this.context.state.name = ev.target.value
    }

    @action.bound onCoverLetter(ev: React.ChangeEvent<HTMLTextAreaElement>) {
        this.coverLetter = ev.target.value
    }

    @action.bound onCV(ev: React.ChangeEvent<HTMLInputElement>) {
        const file = (ev.target.files as FileList)[0]

        const reader = new FileReader()
        reader.onload = () => {
            runInAction(() => {
                this.cvFile = {
                    filename: file.name,
                    contentType: file.type,
                    dataUri: reader.result as string
                }
            })
        }

        reader.onerror = () => {
          console.error(reader.error)
          this.error = (reader.error as DOMException).toString()
        };

        reader.readAsDataURL(file)
    }

    render() {
        return <React.Fragment>
            {this.redirectTo && <Redirect push to={this.redirectTo}/>}
            <h1>Apply to be an Immunotherapy Scientist at HelixNano</h1>
            <p>Helix Nanotechnologies is looking for an experienced scientist to lead the development of personalized cancer vaccines.</p>
            <form method="POST" onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" className="form-control" placeholder="Your full name" onChange={this.onName} value={this.context.state.name} required disabled={this.isLoading}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" name="email" type="email" className="form-control" placeholder="Your email" onChange={this.onEmail} value={this.context.state.email} required disabled={this.isLoading}/>
                </div>
                <div className="form-group">
                    <label htmlFor="coverLetter">Cover Letter</label>
                    <textarea id="coverLetter" name="coverLetter" className="form-control" rows={8} onChange={this.onCoverLetter} placeholder="What makes you a good fit for this role?" required disabled={this.isLoading}/>
                </div>
                <div className="form-group">
                    <label htmlFor="cvFile">CV</label>
                    <input id="cvFile" name="cvFile" type="file" className="form-control-file" onChange={this.onCV} required disabled={this.isLoading}/>
                </div>
                {this.isLoading ?
                    <button className="btn btn-success" type="button" disabled={this.isLoading}>
                        <span>Submit application </span>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="sr-only">Loading...</span>
                    </button>
                    :
                    <input type="submit" value="Submit application" className="btn btn-success"/>
                }
            </form><br/>
            {this.error ? <div className="alert alert-danger">{this.error}</div> : undefined}
        </React.Fragment>
    }
}

@observer
export class ApplySuccess extends React.Component {
    render() {
        return <React.Fragment>
            <div className="alert alert-success">
                Thank you for your application! We'll be in touch via the email address you provided.
            </div>
        </React.Fragment>
    }
}