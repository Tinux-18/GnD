import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Logo from "./logo";
import Registration from "./registration";
import LogIn from "./log-in";
import ResetPass from "./reset_password";

export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUserLoggedIn: false,
        };
    }
    componentDidMount() {
        console.log("Welcome component mounted");
        fetch(`/user/id.json`)
            .then((res) => res.json())
            .then(({ isUserLoggedIn }) => {
                this.setState({ isUserLoggedIn: isUserLoggedIn });
            })
            .catch((err) =>
                console.log(`fetch user status failed with: ${err}`)
            );
    }
    render() {
        return (
            <>
                <section className="welcome__banner">
                    <Logo />
                    <h1>The Social Leaders Platform</h1>
                </section>
                <BrowserRouter>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <LogIn />
                    </Route>
                </BrowserRouter>
            </>
        );
    }
}
