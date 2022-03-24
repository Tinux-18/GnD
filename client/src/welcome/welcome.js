import { BrowserRouter, Route } from "react-router-dom";
import { useEffect } from "react";

import Logo from "../general/logo.js";
import Footer from "../general/footer";
import Registration from "./registration";
import LogIn from "./log-in";
import ResetPass from "./reset_password";

export default function Welcome() {
    useEffect(() => {
        console.log("Welcome password mounted");
    }, []);
    return (
        <>
            <div className="welcome">
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
                    <Route path="/password-reset">
                        <ResetPass />
                    </Route>
                </BrowserRouter>
            </div>
            <Footer />
        </>
    );
}
