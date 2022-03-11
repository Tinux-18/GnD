import { Component } from "react";
import { Link } from "react-router-dom";

export default class SignIn extends Component {
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
        this.confirmPassword = this.confirmPassword.bind(this);
    }
    componentDidMount() {
        console.log("Registration component mounted");
        console.log("this.state :>> ", this.state);
    }
    inputUpdate({ target }) {
        this.setState({ [target.name]: target.value }, () => {
            // console.log("this.state :>> ", this.state);
        });
    }
    handleSubmit(e) {
        console.log("Submit: ", this.state);
        e.preventDefault();
        let inputErrors = this.state.inputErrors;
        inputErrors.length = 0;
        this.setState({ inputErrors: inputErrors });

        // Input Validation - OPTIMIZE

        if (!this.state.first) {
            let inputErrors = this.state.inputErrors;
            inputErrors.push("first");
            this.setState({ inputErrors: inputErrors });
        }

        if (!this.state.second) {
            let inputErrors = this.state.inputErrors;
            inputErrors.push("second");
            this.setState({ inputErrors: inputErrors });
        }

        if (!this.state.email) {
            let inputErrors = this.state.inputErrors;
            inputErrors.push("email");
            this.setState({ inputErrors: inputErrors });
        }

        if (!this.state.pass1) {
            let inputErrors = this.state.inputErrors;
            inputErrors.push("pass1");
            this.setState({ inputErrors: inputErrors });
        } else if (this.state.pass1 !== this.state.pass2) {
            this.setState({ passError: true });
        } else {
            this.setState({ passError: false });
        }

        // Push data
        if (
            this.state.first &&
            this.state.second &&
            this.state.email &&
            this.state.pass1 &&
            this.state.pass2
        ) {
            fetch("/user/addProfile.json", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    first: this.state.first,
                    second: this.state.second,
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
    confirmPassword(e) {
        if (e.target.value.length <= 1 && e.code == "Backspace") {
            this.setState({ showPasswordConfirmation: false });
        } else {
            this.setState({ showPasswordConfirmation: true });
        }
    }
    render() {
        return (
            <>
                <form id="registration-form">
                    <label htmlFor="registration-form">
                        <h2>Register NOW!</h2>
                    </label>
                    {this.state.inputErrors.length != 0 && (
                        <h3 id="error">Please fill in the required fields</h3>
                    )}
                    {this.state.generalError && (
                        <h3 id="error">
                            Something went wrong. Please try again!
                        </h3>
                    )}
                    <label htmlFor="first">First name</label>
                    <input
                        name="first"
                        id="first"
                        type="text"
                        maxLength="255"
                        placeholder="Mihaela"
                        required
                        onChange={this.inputUpdate}
                        style={{
                            backgroundColor: this.state.inputErrors.includes(
                                "first"
                            )
                                ? "#ffafcc"
                                : "white",
                        }}
                    ></input>
                    <label htmlFor="second">Last name</label>
                    <input
                        name="second"
                        id="second"
                        type="text"
                        maxLength="255"
                        placeholder="Drăgan"
                        required
                        onChange={this.inputUpdate}
                        style={{
                            backgroundColor: this.state.inputErrors.includes(
                                "second"
                            )
                                ? "#ffafcc"
                                : "white",
                        }}
                    ></input>
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
                        onChange={(e) => {
                            this.inputUpdate(e);
                            this.confirmPassword(e);
                        }}
                        style={{
                            backgroundColor: this.state.inputErrors.includes(
                                "pass1"
                            )
                                ? "#ffafcc"
                                : "white",
                        }}
                    ></input>
                    {this.state.showPasswordConfirmation && (
                        <>
                            <label htmlFor="pass2">Repeat Password</label>
                            <input
                                name="pass2"
                                id="pass2"
                                type={
                                    this.state.showPasswordConfirmation
                                        ? "password"
                                        : "hidden"
                                }
                                minLength="3"
                                required
                                onChange={this.inputUpdate}
                                style={{
                                    backgroundColor:
                                        this.state.error && "#ffafcc",
                                }}
                            ></input>
                        </>
                    )}
                    <button onClick={this.handleSubmit}>Register</button>
                    <Link to="/login" id="login-link">
                        Click here to Log in!
                    </Link>
                </form>
            </>
        );
    }
}
