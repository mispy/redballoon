import React = require("react")
import { action, observable, computed, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import md5 = require('md5')

@observer
export class ShowInviteLink extends React.Component<{ userSlug: string }> {
    @computed get userId() {
        const spl = this.props.userSlug.split(/-/g)
        return spl[spl.length-1]
    }

    @computed get userName() {
        return decodeURIComponent(this.props.userSlug.replace(/-[^-]+$/, "").replace(/\+/g, ' '))
    }

    @computed get canonicalUrl() {
        return window.location.origin
    }

    @computed get inviteLink() {
        return `${this.canonicalUrl}/${this.props.userSlug}`
    }

    render() {
        return <React.Fragment>
            <p><strong>Your invite link:</strong></p>
            <div className="alert alert-success">
                {this.inviteLink}
            </div>
            <p>If a researcher successfully applies for this position using the link above, you will get <strong>$1000</strong>. If you invite someone who then invites the successful applicant, you'll get <strong>$500</strong>, and so on.</p>
            <p>If you win a reward, we'll contact you at the email address you provided. Invite all your friends!</p>
            <p>You can also <a href="https://helixnano.com/jobs">apply for the position yourself</a>.</p>
        </React.Fragment>
    }
}