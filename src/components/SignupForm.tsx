import React = require("react")

interface Person {
    name: string
    email: string
}

const savePerson = (person: Person) => {
    return fetch(`/.netlify/functions/savePerson`, {
        body: JSON.stringify(person),
        method: 'POST'
    }).then(response => {
        return response.json()
    })
}

export class SignupForm extends React.Component<{}, { name: string, email: string }> {
    constructor(props: {}) {
        super(props)
        this.state = {
            email: "",
            name: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(ev: React.FormEvent) {
        savePerson({ name: this.state.name, email: this.state.email })
        ev.preventDefault()
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target


        this.setState({
            [target.name]: target.value
        } as any);
    }

    render() {
        return <React.Fragment>
            <h2>Sign up</h2>
            <form method="POST" onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" name="email" type="email" className="form-control" placeholder="Your email" onChange={this.handleInputChange} value={this.state.email} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" className="form-control" placeholder="Your name" onChange={this.handleInputChange} value={this.state.name} required/>
                </div>
                <input type="submit" value="Join Team" className="btn btn-primary" />
            </form>
        </React.Fragment>
    }
}