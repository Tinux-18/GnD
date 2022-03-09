import React from "react";

export default class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: "" };
        this.inputUpdate = this.inputUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("Registration component mounted");
    }
    inputUpdate({ target }) {
        this.setState({ [target.name]: target.value }, () =>
            console.log("this.state :>> ", this.state)
        );
    }
    handleSubmit(e) {
        console.log("Submit: ", this.state);
        e.preventDefault();
        fetch("/user/registration.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log("res :>> ", res);

                // if error update error message
                // if not error location.reload
            });
    }
    render() {
        return (
            <>
                {this.state.error && <h2>Something went wrong</h2>}
                <form>
                    <input
                        name="first"
                        id="first"
                        type="text"
                        placeholder="Mihaela"
                        required
                        onChange={this.inputUpdate}
                    ></input>
                    <input
                        name="second"
                        id="second"
                        type="text"
                        placeholder="Drăgan"
                        required
                        onChange={this.inputUpdate}
                    ></input>
                    <input
                        name="email"
                        id="email"
                        type="email"
                        placeholder="miha.dragan@tnb.ro"
                        required
                        onChange={this.inputUpdate}
                    ></input>
                    <input
                        name="pass1"
                        id="pass1"
                        type="password"
                        required
                    ></input>
                    <input
                        name="pass2"
                        id="pass2"
                        type="password"
                        required
                    ></input>
                    <button onClick={this.handleSubmit}>Register</button>
                </form>
            </>
        );
    }
}
