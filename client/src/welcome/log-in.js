import { Component } from "react";

// export default class LogIn extends Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         return <div>Hello, World & Fuck you!</div>;
//     }
// }

export default class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            generalError: false,
            passError: false,
            error: false,
            inputErrors: [],
            showPasswordConfirmation: false,
        };
        this.inputUpdate = this.inputUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("LogIn mounted");
    }
    inputUpdate({ target }) {
        this.setState({ [target.name]: target.value }, () => {});
    }
    handleSubmit(e) {
        console.log("Submit: ", this.state);
        e.preventDefault();
        let inputErrors = this.state.inputErrors;
        inputErrors.length = 0;
        this.setState({ inputErrors: inputErrors });

        // // Input Validation - OPTIMIZE

        if (!this.state.email) {
            let inputErrors = this.state.inputErrors;
            inputErrors.push("email");
            this.setState({ inputErrors: inputErrors });
        }

        if (!this.state.pass1) {
            let inputErrors = this.state.inputErrors;
            inputErrors.push("pass1");
            this.setState({ inputErrors: inputErrors });
        }

        // // Push data
        if (this.state.email && this.state.pass1) {
            fetch("/user/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    email: this.state.email,
                    pass: this.state.pass1,
                }),
            })
                .then((res) => res.json())
                .then((postResponse) => {
                    console.log("res :>> ", postResponse);
                    if (postResponse.success) {
                        location.reload();
                    } else {
                        this.setState({ generalError: true });
                    }
                })
                .catch((err) => {
                    console.log(
                        `fetch POST in registration failed with: ${err}`
                    );
                    this.setState({ generalError: true });
                });
        } else {
            this.setState({ error: true });
        }
    }
    render() {
        return (
            <>
                <form id="registration-form">
                    <label htmlFor="registration-form">
                        <h2>Log in</h2>
                    </label>
                    {this.state.inputErrors.length != 0 && (
                        <h3 id="error">Please fill in the required fields</h3>
                    )}
                    {this.state.generalError && (
                        <h3 id="error">
                            Something went wrong. Please try again!
                        </h3>
                    )}
                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        id="email"
                        type="email"
                        maxLength="255"
                        placeholder="miha.dragan@tnb.ro"
                        onChange={this.inputUpdate}
                        required
                        style={{
                            backgroundColor: this.state.inputErrors.includes(
                                "email"
                            )
                                ? "#ffafcc"
                                : "white",
                        }}
                    ></input>
                    {this.state.passError && (
                        <h4 id="error">Your passwords do not match</h4>
                    )}
                    <label htmlFor="pass1">Password</label>
                    <input
                        name="pass1"
                        id="pass1"
                        type="password"
                        minLength="3"
                        placeholder="***"
                        required
                        onChange={this.inputUpdate}
                        style={{
                            backgroundColor: this.state.inputErrors.includes(
                                "pass1"
                            )
                                ? "#ffafcc"
                                : "white",
                        }}
                    ></input>
                    <div className="buttons">
                        <button onClick={this.handleSubmit}>Log in</button>
                        <input
                            type="reset"
                            value="Reset"
                            id="reset"
                            onClick={() => {
                                this.setState({
                                    generalError: false,
                                    passError: false,
                                    error: false,
                                    inputErrors: [],
                                });
                            }}
                        ></input>
                    </div>
                </form>
            </>
        );
    }
}
