import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Logo from "./logo";
import Registration from "./registration";
import LogIn from "./log-in";
import ResetPass from "./reset_password";

export default class Welcome extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log("Welcome component mounted");
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
