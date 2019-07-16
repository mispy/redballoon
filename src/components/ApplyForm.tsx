import React = require("react")
import { action, observable, computed, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import { Redirect } from "react-router-dom"

import { applyForPosition } from '../api'

@observer
export class ApplyForm extends React.Component<{ referringUserSlug?: string }> {
    @observable email: string = ""
    @observable name: string = ""
    @observable coverLetter: string = ""
    @observable cvFile: { filename: string, contentType: string, dataUri: string }|null = null

    @observable isLoading: boolean = false
    @observable loadingButton: string = ''
    @observable error?: string
    @observable redirectTo?: string


    async save() {
        if (!this.cvFile) return

        try {
            this.isLoading = true
            const res = await applyForPosition({ 
                email: this.email,
                name: this.name, 
                coverLetter: this.coverLetter,
                cvFile: this.cvFile
            })
            runInAction(() => {
                // this.redirectTo = `/success/${encodeURIComponent(this.name).replace(/%20/g, "+")}-${res.userId}`
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

    @action.bound onEmail(ev: React.ChangeEvent<HTMLInputElement>) {
        this.email = ev.target.value
    }

    @action.bound onName(ev: React.ChangeEvent<HTMLInputElement>) {
        this.name = ev.target.value
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

        reader.onerror = function (error) {
          console.error(error)
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
                    <input id="name" name="name" type="text" className="form-control" placeholder="Your full name" onChange={this.onName} value={this.name} required disabled={this.isLoading}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" name="email" type="email" className="form-control" placeholder="Your email" onChange={this.onEmail} value={this.email} required disabled={this.isLoading}/>
                </div>
                <div className="form-group">
                    <label htmlFor="coverLetter">Cover Letter</label>
                    <textarea id="coverLetter" name="coverLetter" className="form-control" rows={8} onChange={this.onCoverLetter} placeholder="What makes you a good fit for this role?" required disabled={this.isLoading}/>
                </div>
                <div className="form-group">
                    <label htmlFor="cvFile">CV</label>
                    <input id="cvFile" name="cvFile" type="file" className="form-control-file" onChange={this.onCV} required disabled={this.isLoading}/>
                </div>
                {(this.isLoading && this.loadingButton === 'invite') ?
                    <button className="btn btn-primary" type="button" disabled={this.isLoading}>
                        <span>Submit application</span>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="sr-only">Loading...</span>
                    </button>
                    :
                    <input type="submit" value="Submit application" className="btn btn-primary"/>
                }
            </form><br/>
            {this.error ? <div className="alert alert-danger">{this.error}</div> : undefined}
        </React.Fragment>
    }
}